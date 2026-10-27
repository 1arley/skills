# Hard Rules do Remotion

Esta documentação lista regras proibidas e armadilhas conhecidas no Remotion. Cada regra evita um erro clássico de agentes que tentam criar animações usando padrões inadequados para o paradigma programático do Remotion.

## 1. Proibido tempo real

**NUNCA** usar qualquer dependência do relógio real ou callbacks assíncronos para animar:

```typescript
// ❌ PROIBIDO:
import {useState, useEffect} from 'react';
import {transition} from 'framer-motion';

const Component = () => {
  const [frame, setFrame] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => f + 1);
    }, 1000 / 30);
    
    return () => clearInterval(interval);
  }, []);
  
  // OU use setTimeout
  useEffect(() => {
    setTimeout(() => animate(), 1000);
  }, []);
  
  // OU requestAnimationFrame
  useEffect(() => {
    const raf = requestAnimationFrame(() => step());
    return () => cancelAnimationFrame(raf);
  }, []);
  
  // OU Date.now()
  const now = Date.now();
  const progress = (now - startTime) / duration;
};
```

```typescript
// ✅ CORRETO:
import {useCurrentFrame} from 'remotion';

const Component = () => {
  const frame = useCurrentFrame(); // ← Pura função do frame!
  
  const progress = interpolate(frame, [0, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  return <div style={{opacity: progress}} />;
};
```

**Por que**: Remotion não depende de browser timer, setInterval, ou clock do sistema. Animações são determinísticas e idênticas em todo render. Dependências de tempo real quebram essa propriedade causando renders diferentes entre preview e produção.

### Alternativas permitidas

- `useCurrentFrame()` sempre (para todas animações core)
- `interpolate()` mapeando frame → valor visual
- `spring()` com config explícita (não rely on CSS transition)
- Sequences com `from` e `durationInFrames` derivados de AudioSyncMap.ts
- Transitions via `@remotion/transitions` (TransitionSeries, SpringTiming)

## 2. Sem aleatoriedade solta

**NUNCA** usar Math.random() diretamente, pois resulta em renders não-determinísticos:

```typescript
// ❌ PROIBIDO:
const randomPos = Math.random() * 100; // Diferente a cada render!
const randomColor = colors[Math.floor(Math.random() * colors.length)];
```

```typescript
// ✅ CORRETO:
import {random} from 'remotion';

const randomSeed = "my-seed-string"; // Fixed string
const randomPos = random(randomSeed, 0, 100); // Determinístico!
const randomIndex = random(randomSeed + "-index", 0, colors.length);
```

**Por que**: Renders devem ser idênticos em todos ambientes (local, CI, Lambda). Aleatoriedade introduzida sem seed consistente causa bugs onde mesma input produz outputs diferentes.

### Seed strategy

Sempre usar seeds combináveis baseadas em dados estáticos:

```typescript
function makeRandom(seedBase: string, index: number) {
  return {
    x: random(`${seedBase}-${index}-x`, 0, 100),
    y: random(`${seedBase}-${index}-y`, 0, 50),
    color: random(`${seedBase}-${index}-color`, 0, 3),
  };
}

// Uso consistente:
const circle1 = makeRandom("circles", 0);
const circle2 = makeRandom("circles", 1);
// Sempre mesmo valores para índices fixos
```

## 3. Clamping obrigatório

**SEMPRE** incluir `extrapolateLeft: 'clamp'` e `extrapolateRight: 'clamp'` em interpolate():

```typescript
// ❌ PROIBIDO: extrapolation indeterminística
const scale = interpolate(frame, [0, 30], [0, 1]);

// ✅ CORRETO: clamping explícito
const scale = interpolate(frame, [0, 30], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
```

**Exceção documentada**: Se intencionalmente quiser comportamento diferente, documentar com comentário:
```typescript
// intentional identity extrapolation: allow scale > 1 after animation completes
const scale = interpolate(frame, [0, 30], [0, 2], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'identity', // Documentado explicitamente
});
```

**Por que**: Sem clamping, interpolate continua extrapolando além range definido, causando valores absurdos fora de esperado (opacidade -0,5, escala 5× quando máximo era 1). Isso cria artefatos visuais estranhos no início/fim animações.

## 4. Dimensões e FPS vêm de hooks

**NUNCA** escrever literais 1920, 1080, 30 nas cenas:

```typescript
// ❌ PROIBIDO:
const width = 1920;
const height = 1080;
const fps = 30;

<div style={{width, height}}>

// OU hardcode in Sequence:
<Sequence from={0} durationInFrames={90}> {/* assumes 3fps = 3s */}
```

```typescript
// ✅ CORRETO:
import {useVideoConfig} from 'remotion';

const Component = () => {
  const {width, height, fps} = useVideoConfig();
  
  return (
    <div style={{width, height}}>
      <span>{width}×{height} a {fps}fps</span>
    </div>
  );
};

// OU derivar tudo de AudioSyncMap:
import {FPS, secToFrame} from './AudioSyncMap';
<Sequence from={secToFrame(0)} durationInFrames={secToFrame(3)} />
```

**Por que**: Se usuário muda resolution ou fps depois de codificar, literais esquecidas criam inconsistências graves (animação fora de timing, elementos cortados, aspect ratio distorcido). Hooks garantem responsividade automática.

### Valores padrão da composition

A composição define valores iniciais:

```typescript
<Composition 
  id="Master"
  component={Master}
  width={1920}
  height={1080}
  fps={30} // ← Deve coincidir com timeline do Resolve!
  durationInFrames={calculateDurationInSeconds() * 30}
/>
```

Se usuário mudar fps para 60, todos os cálculos de frames devem se ajustar automaticamente. Usar `fps` de `useVideoConfig()` garante isso.

## 5. Assets determinísticos

Usar exclusivamente APIs determinísticas para carregar mídia:

```typescript
// ❌ PROIBIDO: tags nativas HTML (não controladas pelo compositor Remotion)
<img src="image.png" />
<video src="video.mp4" autoPlay loop />
<audio src="audio.wav" />

// ✅ CORRETO: componentes Remotion
import {Img, Video, Audio, OffthreadVideo, staticFile} from 'remotion';

const Component = () => (
  <>
    <Img src={staticFile('image.png')} />
    <Video src={staticFile('video.mp4')} />
    <Audio src={staticFile('audio.wav')} />
    <OffthreadVideo src={staticFile('external-video.mp4')} />
  </>
);
```

**Fontes também devem ser carregadas oficialmente**:

```typescript
// ❌ PROIBIDO: link tag HTML direto ou import CSS custom
import '../fonts.css'; // Assync loading pode causar flash
   
// ✅ CORRETO: Google Fonts API
import {loadFont} from '@remotion/google-fonts/Inter';

const inter = loadFont('normal', {weights: [400, 700], subsets: ['latin']});

export const waitForFonts = async () => {
  await inter.waitUntilDone();
};

// Em Root.tsx:
export const RemotionRoot = async () => {
  await waitForFonts(); // delayRender() automático
  return <CompositionRegistryProvider><Root /></CompositionRegistryProvider>;
};
```

**Por que**: Tags nativas podem falhar silenciosamente, causar flicker, ou carregar assincronamente criando frames piscantes durante render. APIs Remotion gerenciam cache, timeout, e error boundaries consistentemente.

### delayRender()/continueRender()/cancelRender()

Quando preciso controlar carregamento manualmente:

```typescript
import {delayRender, continueRender, cancelRender} from 'remotion';

const LoadingComponent = async () => {
  const handle = delayRender('loading-image');
  
  try {
    const img = new Image();
    img.src = staticFile('heavy-image.png');
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    
    continueRender(handle);
    return <img src={img.src} />;
  } catch (err) {
    cancelRender(handle);
    console.error('Failed to load:', err);
    throw err;
  }
};
```

Nunca deixar image não carregada entrar na renderização. Sempre esperar onload antes call continueRender().

## 6. Sequences: frame relativo e premount

Entender scoping correto de `useCurrentFrame()` dentro de Sequences:

```typescript
// ❌ INCORRETO: assumir frame absoluto
<Sequence from={0} durationInFrames={30}>
  <div>{useCurrentFrame()}</div> {/* Será 0-29, não 0-29 global */}
</Sequence>

<Sequence from={30} durationInFrames={30}>
  <div>{useCurrentFrame()}</div> {/* Será 0-29 AQUI TAMBÉM! Relativo ao sequence start */}
</Sequence>
```

```typescript
// ✅ CORRETO: frame é relativo ao início da Sequence
<Sequence from={0} durationInFrames={30}>
  <div>{useCurrentFrame()} {/* Frame 0→29 neste sequence */}</div>
</Sequence>

<Sequence from={30} durationInFrames={30}>
  <div>Global frame seria: {useCurrentFrame() + 30} {/* Mas useCurrentFrame() retorna 0-29 local */}</div>
</Sequence>

// Para acessar global frame, calcular externamente:
const globalFrame = sequenceOffset + useCurrentFrame();
```

### Premount para pré-carregamento

Usar `premountFor` para garantir assets/carregamentos prontos antes aparecer:

```typescript
// Pré-carregar elemento complexo 30 frames antes necessário
<Sequence 
  from={30} 
  durationInFrames={60}
  premountFor={30} // começa mount em frame 0, aparece em frame 30
>
  <ComplexDataFetcher /> {/* tem 3s delay na API, mas já começou em frame 0 */}
</Sequence>
```

Isso evita flicker de loading states mostrando momentos críticos.

### TransitionSeries: transições sobrepõem, recalcular total

Em @remotion/transitions, transições **sobrepõem** cenas, reduzindo duração total vs soma simples:

```typescript
// ❌ INCORRETO: somar durações individuais
// Scene 1: 30 frames + Scene 2: 30 frames + transition 10 frames = 70 frames

// ✅ CORRETO: transição conta dentro das sequências adjacentes
// Scene 1: 30 frames (inclui últimos 10 da transition)
// Transition: 10 frames (ocorrendo simultaneamente com final scene1 + inicio scene2)
// Scene 2: 30 frames (inclui primeiros 10 da transition)
// Total = 30 + (30-10) = 50 frames, NÃO 70!
```

Calcular total como: `firstSceneDuration + secondSceneDuration - transitionDuration`.

Erro aqui causa video mais longo que narração ou gaps temporais não sincronizados.

## 7. Molas com duração previsível

Sempre passar `fps` e opcionalmente `durationInFrames` para spring():

```typescript
// ❌ PROIBIDO: mola sem duração fixa (termina quando física decide, não determinístico)
const value = spring({frame, config: mySpringConfig});

// ✅ CORRETO: definir fim explícito
const value = spring({
  frame,
  fps,                    // obrigatório para cálculo frame-based
  config: mySpringConfig,
  durationInFrames: 24,   // força terminar após 24 frames exatamente
});
```

**medirSpring** para saber quando termina (útil para stagger):

```typescript
import {measureSpring, type SpringConfig} from 'remotion';

const END_FRAME = measureSpring({
  fps: 30,
  config: SPRING_SNAPPY,
  threshold: 0.01, // considera terminado quando velocity < 1%
});
// Usar END_FRAME para calcular delays corretamente
```

### Threshold tuning

Default threshold de measureSpring funciona para maioria casos, mas ajustar quando precisão crítica:

```typescript
// Para animações muito rápidas (SNAPPY), aumentar threshold para 0,05
// Para animações muito lentas (SMOOTH), diminuir para 0,005
```

## 8. Traçados SVG: evolvePath, não CSS d

Animar conectores usando evolucao path (@remotion/paths), nunca atributo d por CSS:

```typescript
// ❌ PROIBIDO: CSS transition em d attribute (pior performance, possível flicker)
<path d="M100,100 L200,200" className="animate-path" />
<style>{`.animate-path { transition: d 0.5s; }`}</style>

// ✅ CORRETO: evolvePath com interpolate
import {evolvePath, getPathString} from '@remotion/paths';

const pathProgress = interpolate(frame, [0, 24], [0, 1], {extrapolateLeft: 'clamp'});
const {strokeDasharray, strokeDashoffset} = evolvePath(pathProgress);

<path
  d={getPathString(from, to)}
  strokeDasharray={strokeDasharray}
  strokeDashoffset={strokeDashoffset}
/>
```

**Por que**: CSS transitions em attributes não-numéricos (como path data string) tem suporte inconsistente across browsers e engines. evolvePath desenha progresso numericamente, garantindo smooth rendering.

### getLength para animação proporcional

Para animar baseado em comprimento real do path (não progresso percentual arbitrário):

```typescript
import {getLength} from '@remotion/paths';

const pathLength = getLength(getPathString(startPoint, endPoint));
const drawnLength = interpolate(frame, [0, 30], [0, pathLength], {/* ... */});

// Agora usar drawnLength para strokeDashoffset calculado dinamicamente
```

## 9. Custo de render

Evitar filtros pesados aplicados a muitos elementos simultaneamente:

```typescript
// ❌ PROIBIDO: blurring many elements at once
<div style={{filter: 'blur(10px)'}}>Element 1</div>
<div style={{filter: 'blur(10px)'}}>Element 2</div>
<div style={{filter: 'blur(10px)'}}>Element 3</div>
{/* ... + 100 mais divs */}

// ❌ PROIBIDO: box-shadow com blur grande em repeated pattern
<div style={{boxShadow: '0 0 20px rgba(0,0,0,0.5)'}}>Card</div>
<div style={{boxShadow: '0 0 20px rgba(0,0,0,0.5)'}}>Card</div>

// ✅ CORRETO: aplicar filter apenas em camada única no fundo
<AbsoluteFill>
  <div style={{filter: 'blur(10px)', opacity: 0.3}}>Background</div>
</AbsoluteFill>
<div>Foreground element (sharp)</div>
```

**Por que**: Filtros CSS são computacionalmente caros, especialmente blurs grandes. Aplicações repetidas multiplicam custo exponencialmente. Desenhar blur em único background layer é até 10× mais rápido.

### Benchmark recomendado

Antes finalizar projeto, rodar benchmark local:

```bash
# Renderizar frames 0-120 medindo time
time npx remotion render Master out/benchmark.mp4 --frames=0-120
# Repetir 3x e registrar average time
```

Se >5 seg por frame em máquinas razoáveis, otimizar filtros antes pedir render master.

## 10. Versões alinhadas

**TODAS** pacotes Remotion devem ter EXATAMENTE mesma versão exata, sem caret (^):

```json
// ❌ PROIBIDO:
{
  "dependencies": {
    "remotion": "^4.0.539",
    "@remotion/cli": "4.0.538",      // diferente! Quebra bundler
    "@remotion/transitions": "4.0.539",
    "@remotion/shapes": "4.0.540"    // divergente! Pode falhar render
  }
}

// ✅ CORRETO: todas pinadas à mesma versão
{
  "dependencies": {
    "remotion": "4.0.539",
    "@remotion/cli": "4.0.539",
    "@remotion/transitions": "4.0.539",
    "@remotion/shapes": "4.0.539",
    "@remotion/paths": "4.0.539",
    "@remotion/google-fonts": "4.0.539",
    "@remotion/media-utils": "4.0.539",
    "@remotion/install-whisper-cpp": "4.0.539",
    "@remotion/bundler": "4.0.539",
    "@remotion/studio": "4.0.539",
    "@remotion/eslint-plugin": "4.0.539"
  }
}
```

**Por que**: Pacotes Remotion têm dependências internas cruzadas. Versões ligeiramente diferentes quebram contratos esperados entre bibliotecas, causando erros crypticos de bundling ou runtime failures silenciosas.

### Comandoseguro instalar

Sempre usar `npx remotion add`:

```bash
# Seguro: detecta version atual e instala pacote compatível
npx remotion add @remotion/transitions
npx remotion add @remotion/shapes

# Nunca fazer manualmente (a menos que saiba o que está fazendo):
# npm install @remotion/something@latest
```

Ou fixar explicitamente em package.json:

```json
{
  "resolutions": {
    "@remotion/*": "4.0.539"
  }
}
```

## 11. Organização do Root.tsx

Seguir estrutura de folders padronizada para facilitar navegação e manutenção:

```typescript
// Root.template.tsx
import {Folder, AbsoluteFill, Sequence} from 'remotion';

export const Root = () => (
  <AbsoluteFill>
    {/* 01-Piloto: composição piloto de 5-10s verificando tokens/direção */}
    <Folder name="01-Piloto">
      <Sequence from={0} durationInFrames={90}>
        <PilotComposition />
      </Sequence>
    </Folder>
    
    {/* 02-Variacoes: rascunhos de variações pedagógicas */}
    <Folder name="02-Variacoes">
      <Folder name="VarA_FluxoLinear">
        <Sequence from={0} durationInFrames={90}>
          <VarA_PilotVariation />
        </Sequence>
      </Folder>
      
      <Folder name="VarB_ComparacaoParalela">
        <Sequence from={0} durationInFrames={90}>
          <VarB_PilotVariation />
        </Sequence>
      </Folder>
      
      {/* Variacoes descartadas movidas pra arquivo */}
      <Folder name="99-Arquivo">
        <Sequence from={0} durationInFrames={90}>
          <UnusedVarC_ZoomHierarquico />
        </Sequence>
      </Folder>
    </Folder>
    
    {/* 03-Cenas-Isoladas: cenas testadas individualmente sem narração */}
    <Folder name="03-Cenas-Isoladas">
      <Sequence from={0} durationInFrames={60}>
        <SceneBeat_01_Introducao />
      </Sequence>
      <Sequence from={0} durationInFrames={60}>
        <SceneBeat_02_ExemploVisual />
      </Sequence>
    </Folder>
    
    {/* 04-Master-Sincronizado: composição final com narração sincronizada */}
    <Folder name="04-Master-Sincronizado">
      <Sequence from={0} durationInFrames={DURATION_IN_FRAMES}>
        <MasterComposition />
      </Sequence>
    </Folder>
    
    {/* 99-Arquivo: código antigo descartado */}
    <Folder name="99-Arquivo">
      <Sequence from={0} durationInFrames={60}>
        <OldApproach_KeepAsReference />
      </Sequence>
    </Folder>
  </AbsoluteFill>
);
```

**Regra**: Nenhum folder deve ultrapassar número de beats que possa renderizar em tempo razoável (~2min total = ~3600 frames a 30fps). Dividir em sub-cenas maiores se necessário.

## 12. Lint ativo

Manter ESLint configurado com plugin @remotion/eslint-plugin ativado:

```json
// .eslintrc.json
{
  "extends": ["plugin:@remotion/recommended"],
  "rules": {
    // Regras específicas override opcionais
    "@remotion/no-string-assets": "error",
    "@remotion/staticfile-no-relative": "error",
    "even-dimensions": "warn"
  }
}
```

**Comandos obrigatórios antes de checkpoint**:

```bash
# TypeScript check (sem emit, só tipos)
npx tsc --noEmit

# ESLint check
npx eslint src/**/*.tsx --max-warnings 0

# Se ambos limpos, prosseguir para still audit e teste
```

Nunca ignorar warnings de lint assumindo "funciona mesmo assim". Muitos warnings indicam anti-padrões que vão falhar em produção.

