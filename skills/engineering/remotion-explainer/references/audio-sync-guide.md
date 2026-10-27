# Guia de Sincronização com Narração

Esta documentação define como transcrever áudio, gerar cues por palavra, calcular metadata e antecipar visualmente cada evento vocal em animações Remotion explicativas.

## Transcrição do Áudio

### Pré-requisitos

Para transcrever áudio corretamente com Whisper.cpp, garantir:

1. **Áudio preparado**: Arquivo WAV 16-bit, 16kHz (se necessário, resample via ffmpeg antes)
   ```bash
   ffmpeg -i narracao.mp3 -ar 16000 -ac 1 -bit_depth 16 public/narracao.wav
   ```

2. **Whisper.cpp instalado**: Executar scripts/transcribe-narration.mjs instala whisper.cpp automaticamente ou usar existente:
   ```bash
   # Instalar se não existe
   npx remotion install-whisper-cpp --version 1.5.5 --to whisper.cpp
   
   # Baixar modelo específico (medium.en para PT-BR é bom balance qualidade/tamanho)
   npx remotion download-whisper-model --model medium.en --folder whisper.cpp/models
   ```

3. **Node.js compatível**: Whisper.cpp requer Node ≥ 18 funcional em Linux (glibc ≥ 2.35). Em macOS funciona nativamente com Rosetta ou ARM64.

### Script de transcrição

Usar script automatizado em `scripts/transcribe-narration.mjs` que:

```javascript
// scripts/transcribe-narration.mjs (exemplo simplificado)
import {transcribe, installWhisperCpp, downloadWhisperModel} from '@remotion/install-whisper-cpp';
import {readFileSync, writeFileSync} from 'fs';
import {join} from 'path';

async function transcribeNarration() {
  // 1. Instalar whisper.cpp se necessário
  await installWhisperCpp({
    version: '1.5.5',
    to: './whisper.cpp',
  });
  
  // 2. Baixar modelo medium.en (equilíbrio qualidade/velocidade PT-BR)
  await downloadWhisperModel({
    model: 'medium.en',
    folder: './whisper.cpp/models',
  });
  
  // 3. Transcrever com timestamps word-level
  const result = await transcribe({
    inputPath: join(process.cwd(), 'public/narracao.wav'),
    whisperPath: join(process.cwd(), 'whisper.cpp'),
    whisperCppVersion: '1.5.5',
    model: 'medium.en',
    tokenLevelTimestamps: true, // essencial para timing preciso
    language: 'Portuguese',     // OU null para auto-detect
    splitOnWord: true,          // mais limpo, um token por item
    printOutput: false,         // silencioso em pipeline CI
  });
  
  // 4. Converter para formato cues.json esperado
  const cues = {
    words: result.transcription.map((item, idx) => ({
      index: idx,
      text: item.text,
      fromMs: Math.floor(parseFloat(item.timestamps.from) * 1000),
      toMs: Math.floor(parseFloat(item.timestamps.to) * 1000),
      estimated: false,
      cueLabel: determineCueLabel(item, idx, result.transcription), // helper para semantic grouping
    })),
    totalDuration: result.result.durationSeconds,
  };
  
  // 5. Escrever arquivo JSON público
  writeFileSync(
    join(process.cwd(), 'public/narration.cues.json'),
    JSON.stringify(cues, null, 2)
  );
  
  console.log(`✅ Transcrição completa: ${cues.words.length} palavras, ${cues.totalDuration.toFixed(1)}s`);
  return cues;
}

function determineCueLabel(word, index, allWords) {
  // Agrupamento semântico simples: cada frase nova = novo cue label
  // Melhor implementação: usar pontuação (.!?!) para detectar fim de frase
  if (word.text.endsWith('.') || word.text.endsWith('!') || word.text.endsWith('?')) {
    return `frase_${index}`;
  }
  return `palavra_${index}`;
}

export default transcribeNarration;
```

### Formato de saída

Arquivo `public/narration.cues.json` deve ter estrutura:

```json
{
  "words": [
    {
      "index": 0,
      "text": "Olá",
      "fromMs": 0,
      "toMs": 320,
      "estimated": false,
      "cueLabel": "introducao"
    },
    {
      "index": 1,
      "text": "bem-vindo",
      "fromMs": 320,
      "toMs": 680,
      "estimated": false,
      "cueLabel": "introducao"
    },
    {
      "index": 2,
      "text": "ao",
      "fromMs": 680,
      "toMs": 840,
      "estimated": false,
      "cueLabel": "introducao"
    }
    // ... até última palavra
  ],
  "totalDuration": 45.7
}
```

**Campos obrigatórios**:
- `index`: ordem sequencial (0-based)
- `text`: conteúdo da palavra transcrita
- `fromMs`: tempo início em milissegundos (desde início áudio)
- `toMs`: tempo fim em milissegundos
- `estimated`: `false` se Whisper gerou, `true` se estimado manualmente
- `cueLabel`: rótulo semântico agrupando palavras em beats (opcional mas recomendado)

## Estimativa Manual (sem áudio pronto)

Quando narração ainda não gravada, estimar cues baseado no roteiro escrito:

### Regra básica de velocidade

PT-BR promedio leitor natural: **2,5 palavras por segundo**. Para ritmo mais lento/apaixonado: 2,0 pps. Para ritmo acelerado/rápido: 3,0 pps. Usar 2,5 como padrão inicial.

### Algoritmo de estimativa

```javascript
// scripts/transcribe-narration.mjs (modo estimado)
function estimateCuesFromScript(scriptText, speedPPS = 2.5) {
  const palavras = scriptText.split(/\s+/).filter(Boolean);
  let acumuladoMs = 0;
  
  return palavras.map((palavra, idx) => ({
    index: idx,
    text: palavra,
    fromMs: acumuladoMs,
    toMs: acumuladoMs + (1000 / speedPPS), // duração uniforme ≈400ms/palavra
    estimated: true,
    cueLabel: gerarCueLabelSemantico(palavra, idx, palavras),
  })).reduce((acc, palavra, idx, arr) => {
    // Corrigir último word toMs para totalDuration
    if (idx === arr.length - 1) {
      palavra.toMs = arr.length / speedPPS * 1000;
    } else {
      // Somar próxima palavra ao atual toMs
      acc[idx].toMs = arr[idx + 1].fromMs;
    }
    return acc;
  }, []);
}
```

### Marcar TODO(sync)

Em todos lugares onde estimativa foi usada, adicionar comentário explícito:

```typescript
// src/AudioSyncMap.ts
export const CUE = {
  INTRO_PROBLEMA: { 
    label: "Introdução do problema", 
    sec: 0.0, 
    quote: "Olá, bem-vindo à explicação",
    estimated: true // ⚠️ ESTIMATIVA - substituir quando audio final disponível
  },
  EXPLICA_RECOMPILACAO: { 
    label: "Explica a recompilação", 
    sec: 7.2, // derivado de cues.json (sum(fromMs)/1000)
    quote: "A recompilação traduz chamadas",
    estimated: true // TODO(sync): verificar timestamp real
  },
};
```

Isso garante ninguém use valores estimados em produção sem consciência do risco.

## Mapeamento Semântico para AudioSyncMap.ts

### Estrutura do arquivo

`src/AudioSyncMap.ts` é a **única fonte de verdade temporal** do projeto. Todos os frames derivados daqui, nenhum número literal permitido fora dele.

```typescript
// src/AudioSyncMap.ts
export const FPS = 30; // ← Deve COINCIDIR COM TIMELINE DO RESOLVE (confirme isso!)

export const secToFrame = (sec: number): number => Math.round(sec * FPS);

export const LEAD_FRAMES = secToFrame(0.12); // Antecipação visual da narração

export const CUE = {
  // Cada beat mapeado a um cue semântico
  INTRO_PROBLEMA: {
    label: "Introdução do problema",
    sec: 0.0,               // Tempo absoluto desde início áudio
    quote: "Olá, hoje veremos...",
    estimated?: boolean,    // true se estimado manualmente
  },
  EXPLICA_RECOMPILACAO: {
    label: "Explica a recompilação estática",
    sec: 7.4,
    quote: "A recompilação converte chamadas de sistema para API Windows",
    estimated?: true,
  },
  MOSTRA_WINDOWS_API: {
    label: "Mostra a API do Windows",
    sec: 12.1,
    quote: "Antes era NtQuerySystemInformation, agora CallWindowProc",
    estimated?: true,
  },
  CONCLUSAO: {
    label: "Conclusão",
    sec: 22.5,
    quote: "Resumo: recompilação permite adaptação automática",
    estimated?: false,      // ← Agora com audio real
  },
} as const satisfies Record<string, Cue>;

type Cue = {
  label: string;
  sec: number;
  quote: string;
  estimated?: boolean;
};
```

### Derivação de durações

Todas as durações de sequences devem **derivar exclusivamente** de CUE.*:

```typescript
// ❌ PROIBIDO: números literais
<Sequence from={0} durationInFrames={36}>

// ✅ CORRETO: derivado de AudioSyncMap
<Sequence 
  from={secToFrame(CUE.INTRO_PROBLEMA.sec)} 
  durationInFrames={secToFrame(CUE.EXPLICA_RECOMPILACAO.sec - CUE.INTRO_PROBLEMA.sec) + LEAD_FRAMES}
>
```

### Antecipação visual aplicada

Evento visual importante (destaque, troca de estado, seta desenhando) começa **LEAD_FRAMES** antes da palavra vocalizada correspondente. Exemplo:

```typescript
// Evento acontece LEAD_FRAMES antes da palavra "recompilação" no frame 190 (7,4s × 30fps)
// → Evento inicia em frame 190 - 4 = 186 (~6,87s)

const eventoStartFrame = secToFrame(CUE.EXPLICA_RECOMPILACAO.sec) - LEAD_FRAMES;

<Sequence from={eventoStartFrame} durationInFrames={18}>
  <StateBadge state="active">Recompilação</StateBadge>
</Sequence>
```

### Validação de consistência

Antes de renderizar master, rodar validação:

```bash
# Verificar FPS coincide com Resolve timeline
grep "export const FPS" src/AudioSyncMap.ts
# Saída esperada: export const FPS = 30; ← Confirme 30 igual ao seu Resolve!

# Garantir nenhum literal numérico além de cálculos
grep -rn "from=\{[0-9]\+\}" src --exclude="AudioSyncMap.ts"
# Resultado: vazio (nenhum literal encontrado)

# Confirmar todas durations derivam de CUE
grep -rn "durationInFrames={secToFrame(CUE\." src | wc -l
# Deve contar número significativo de occurrences (>5 expected)
```

## Duração Master do Áudio

### Método 1: getAudioDurationInSeconds (@remotion/media-utils)

```typescript
// scripts/calculate-master-duration.mts
import {getAudioDurationInSeconds} from '@remotion/media-utils';

export async function calculateMasterDuration(audioPath: string): Promise<number> {
  const duration = await getAudioDurationInSeconds(audioPath);
  console.log(`🎵 Áudio duração: ${duration.toFixed(2)}s = ${Math.round(duration * 30)} frames`);
  return duration;
}
```

**Nota**: Esta função usa `<audio>` tag interna e pode falhar com formatos não suportados pelo navegador. Preferir MediaBunny para maior confiabilidade.

### Método 2: getMediaMetadata (@mediabunny/core)

```typescript
// scripts/calculate-master-duration.mts (versão recomendada)
import {Input, ALL_FORMATS, FileSource} from 'mediabunny';

export async function calculateMasterDuration(audioPath: string): Promise<number> {
  const input = new Input({
    formats: ALL_FORMATS,
    source: new FileSource(audioPath),
  });
  
  const duration = await input.computeDuration();
  console.log(`🎵 Áudio duração: ${duration.toFixed(2)}s = ${Math.round(duration * 30)} frames`);
  return duration;
}
```

### Atualizando AudioSyncMap quando narração regravada

Se usuário regrava áudio com duração diferente:

1. **Regenerar cues.json**: reexecutar scripts/transcribe-narration.mjs
2. **Recalcular tempos absolutos**: somar cumulativamente timestamps das palavras
3. **Atualizar CUE.* sec values**: editar manualmente src/AudioSyncMap.ts com novos valores
4. **Verificar consistência**: grep novamente por literais `from=`

Exemplo de atualização manual após registo:

```typescript
// BEFORE (estimado):
export const CUE = {
  CONCLUSAO: { label: "Conclusão", sec: 22.5, quote: "..." },
};

// AFTER (real - audio agora 45s ao invés de 60s):
export const CUE = {
  CONCLUSAO: { label: "Conclusão", sec: 38.2, quote: "..." }, // ajustado de 22,5 → 38,2
};

// O vídeo inteiro se recalcula sozinho porque todas Sequences derivam de CUE.CONCLUSAO.sec
```

### calculateMetadata integration

Opcionalmente, definir durationInFrames via calculateMetadata():

```typescript
// Root.template.tsx
export const calculateMetadata: CalculateMetadataFunction<Props> = async () => {
  const audioDuration = await calculateMasterDuration('public/narracao.wav');
  return {
    durationInFrames: Math.round(audioDuration * FPS),
    defaultCodec: 'h264',
    defaultPixelFormat: 'yuv420p',
    defaultColorSpace: 'bt709',
  };
};
```

Vantagem: duration recalcula automaticamente se áudio mudado. Desvantagem: perde controle fino sobre edge cases.

### Regra crítica de precisão

**Duração master ±1 frame** da duração real do áudio é aceitável. ±2+ frames indica erro grave e precisa investigação:

- Verificar FPS em AudioSyncMap.ts coincide com video config
- Confirmar timestamps do cues.json estão em milissegundos (não segundos)
- Checar arredondamentos manuais foram aplicados corretamente
- Executar ffprobe para medir duração real do áudio usado

Validação com ffprobe:
```bash
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 public/narracao.wav
# Saída: 45.670000 (exemplo)
```

Comparar: `Math.abs(audioDurationSecs * FPS - durationInFrames)` ≤ 1? Se não, corrigir.

## Checklist pré-render final

Antes de renderizar versão final, confirmar todos estes itens:

- [ ] FPS em AudioSyncMap.ts = FPS da timeline do Resolve (ambos 30, ambos 60, ou ambos 24)
- [ ] Nenhum literal numérico `from={N}` nas cenas (exceto dentro AudioSyncMap.ts)
- [ ] Todos cues transcritos com Whisper (estimated: false) OU claramente marcados estimado: true
- [ ] Total duration calculated via Mediabunny/getAudioDuration
- [ ] Duracao master ±1 frame da duração real de áudio
- [ ] LEAD_FRAMES aplicado consistentemente (eventos começam 12 frames antes da palavra)
- [ ] Still-audit executado nos frames de cada cue (confirmar evento correto aparece)
- [ ] Teste de audição feito no Studio com áudio carregado
- [ ] Desvios anotados (ex: "destaque entra tarde em 00:12")
- [ ] Ajustes aplicados apenas em AudioSyncMap.ts (nunca codificar diretamente frames)

Se qualquer negativamente, não prosseguir para Etapa 6 (render). Revisar sincronização primeiro.

