# Guia de Render para DaVinci Resolve

Esta documentação define perfis de render, flags FFmpeg recomendadas, validação de saída e checklist de importação no DaVinci Resolve.

## Perfis de Render (scripts/render-profiles.sh)

### Preview: rascunho rápido para revisão timing

```bash
#!/bin/bash
# scripts/render-profiles.sh

set -e  # exit immediately on error

echo "🎬 Renderizando preview (rascunho rápido)..."
npx remotion render Master out/preview.mp4 \
  --scale=0.5 \
  --crf=28 \
  --codec=h264 \
  --pixel-format=yuv420p \
  --muted

echo "✅ Preview gerado em out/preview.mp4"
echo "   Resolução reduzida: 960×540 (50% scale)"
echo "   CRF=28: qualidade aceitável para revisão interna"
echo "   Tamanho estimado: ~10-30MB para vídeo de 60s"
```

**Uso**: 
- Revisão rápida de timing sem esperar render full
- Testar diferentes configurações de AudioSyncMap rapidamente
- Verificar stills antes commit final

**Limitações**: Baixa resolução não representa nitidez final. Usar apenas para timing, não para aprovação visual detalhada.

### Master: entrega para o DaVinci Resolve

```bash
echo "🎬 Renderizando master (entrega para edição)..."
npx remotion render Master out/master.mp4 \
  --codec=h264 \
  --crf=16 \
  --pixel-format=yuv420p \
  --color-space=bt709 \
  --hardware-acceleration=if-possible \
  --muted

echo "✅ Master gerado em out/master.mp4"
echo "   Resolução nativa: 1920×1080 (ou --scale=2 → 3840×2160)"
echo "   CRF=16: alta qualidade, adequado para master editável"
echo "   Color space: bt709 (padrão HD TV, compatível com Resolve)"
echo "   Áudio: muted (mix narracao no Resolve se necessário)"
```

**Flags explicadas**:

| Flag | Valor | Motivo |
|------|-------|--------|
| `--codec=h264` | h264 | Codec amplamente suportado pelo Resolve |
| `--crf=16` | 16 | Qualidade alta (baixo compression artifact), ideal para pós-produção |
| `--pixel-format=yuv420p` | yuv420p | Formato padrão H.264, melhor compatibilidade |
| `--color-space=bt709` | bt709 | Espaço de cor HDTV standard, Resolve interpreta corretamente |
| `--hardware-acceleration=if-possible` | if-possible | Usa GPU se disponível, fallback software automaticamente |
| `--muted` | — | Sem áudio embutido, narração final mixada no Resolve |

**Configuração automática via remotion.config.ts** (recomendado para persistência):

```typescript
// remotion.config.ts
import {Config} from '@remotion/cli/config';

Config.setCodec('h264');
Config.setCrf(16);
Config.setPixelFormat('yuv420p');
Config.setColorSpace('bt709');
Config.setHardwareAcceleration('if-possible');

export default {};
```

**Importante**: Se usar config.ts, flags CLI override automaticamente se explicitamente fornecidas. Preferir config.ts para defaults consistentes entre renders.

### Alpha: animação sobreposta a B-roll ou talking head

```bash
echo "🎬 Renderizando alpha pass (overlay transparente)..."
npx remotion render Master out/master-alpha.mov \
  --codec=prores \
  --prores-profile=4444 \
  --pixel-format=yuva444p10le \
  --image-format=png \
  --muted

echo "✅ Alpha pass gerado em out/master-alpha.mov"
echo "   Codec ProRes 4444 XQ: suporta canal alfa completo"
echo "   Pixel format: yuva444p10le (alpha channel incluído)"
echo "   Image format: png frames (alta qualidade, sem compressão lossy)"
echo "   Use como overlay sobre video base no Resolve"
```

**Requisitos do composition para alpha**:
```typescript
// Root.template.tsx
export const AlphaComposition: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* NÃO definir background color! Deve ser transparent por padrão */}
      {/* Elementos gráficos apenas (ícones, setas, texto) */}
      <AnimatedArrow from={a} to={b} />
      <StateBadge state="active" />
      {/* O fundo será transparente no render alpha */}
    </AbsoluteFill>
  );
};
```

**Procurar erro comum**: verificar checkerboard no Studio antes renderizar alpha. Se tiver background sólido visível, alpha falhará (preto sólido ao invés de transparente).

**Checklist pré-alpha-render**:

- [ ] Fundo absoluto preenchimento removido ou definido `background: undefined`
- [ ] Checkerboard ativado no Studio (botão transparente) para inspeção visual
- [ ] Nenhum elemento usando cor sólida preta (#000) intencionalmente (confundir com ausência de alpha)
- [ ] Todos elementos têm opacidade >0 onde visível
- [ ] Config prores 4444 confirmado em remotion.config.ts

## Validação do Arquivo

### ffprobe verificação automática

```bash
#!/bin/bash
# scripts/validate-output.sh

VIDEO_FILE="$1"

echo "🔍 Validando $VIDEO_FILE com ffprobe..."

# Extrair metadados
DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$VIDEO_FILE")
FPS=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of default=noprint_wrappers=1:nokey=1 "$VIDEO_FILE")
WIDTH=$(ffprobe -v error -show_entries stream=width -of default=noprint_wrappers=1:nokey=1 "$VIDEO_FILE")
HEIGHT=$(ffprobe -v error -show_entries stream=height -of default=noprint_wrappers=1:nokey=1 "$VIDEO_FILE")
PIXEL_FORMAT=$(ffprobe -v error -show_entries stream=pix_fmt -of default=noprint_wrappers=1:nokey=1 "$VIDEO_FILE")
CODEC=$(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 "$VIDEO_FILE")

echo "✅ Metadados extraídos:"
echo "   Codec: $CODEC"
echo "   Resolução: ${WIDTH}×${HEIGHT}"
echo "   FPS: $FPS"
echo "   Pixel format: $PIXEL_FORMAT"
echo "   Duração: $DURATION segundos"

# Validar contra expectativas
EXPECTED_WIDTH=1920
EXPECTED_HEIGHT=1080
EXPECTED_FPS="30/1"
EXPECTED_PIXEL_FORMAT="yuv420p"
EXPECTED_CODEC="h264"

if [[ "$WIDTH" != "$EXPECTED_WIDTH" ]]; then
  echo "⚠️  WARNING: width $WIDTH != expected $EXPECTED_WIDTH"
fi

if [[ "$HEIGHT" != "$EXPECTED_HEIGHT" ]]; then
  echo "⚠️  WARNING: height $HEIGHT != expected $EXPECTED_HEIGHT"
fi

if [[ "$PIXEL_FORMAT" != "$EXPECTED_PIXEL_FORMAT" ]]; then
  echo "⚠️  WARNING: pixel_format '$PIXEL_FORMAT' != expected '$EXPECTED_PIXEL_FORMAT'"
fi

if [[ "$CODEC" != "$EXPECTED_CODEC" ]]; then
  echo "⚠️  WARNING: codec '$CODEC' != expected '$EXPECTED_CODEC'"
fi

# Validar duração ±1 frame da narração
AUDIO_DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 public/narracao.wav 2>/dev/null || echo "N/A")
DIFF=$(echo "$DURATION - $AUDIO_DURATION" | bc -l)
DIFF_ABS=${DIFF#-}  # abs value

if (( $(echo "$DIFF_ABS > 0.03" | bc -l) )); then
  echo "❌ ERROR: duration difference ${DIFF}s > threshold 0.03s (≈1 frame at 30fps)"
  exit 1
else
  echo "✅ Duration OK: within ±1 frame of audio ($AUDIO_duration s vs video $DURATION s)"
fi

echo "✅ Validação concluída!"
exit 0
```

**Executar após cada render**:

```bash
chmod +x scripts/validate-output.sh
./scripts/validate-output.sh out/master.mp4
```

**Resultados esperados**:
- Todas warnings devem ser resolvidas antes prosseguir
- Erro de duração indica problema em AudioSyncMap.ts ou calculateMetadata()
- Pixel format incorreto pode causar problemas de importação no Resolve

### Frame edge check

Abrir primeiro e último frame manualmente no VLC ou QuickTime:

```bash
# Abrir primeiro frame (frame 0)
npx remotion still Master --frame=0 out/audit/first-frame.png

# Abrir último frame (last frame)
LAST_FRAME=$(ffprobe -v error -show_entries format=nb_frames -of default=noprint_wrappers=1:nokey=1 out/master.mp4)
npx remotion still Master --frame=$((LAST_FRAME - 1)) out/audit/last-frame.png

# Visualizar
open out/audit/first-frame.png
open out/audit/last-frame.png
```

**Verificar**:

- [ ] Primeiro frame começa na posição correta (não mostra fade-in incompleto)
- [ ] Último frame termina limpo (elementos fora de tela se esperado, sem resíduos)
- [ ] Margem segura 96px preservada nos 4 lados (nada cruza borda inferior/superior lateral)
- [ ] Nenhuma palavra cortada ou parcialmente visível na borda
- [ ] Cores batem com Studio (verificar tons exatos, gamma consistente)

## Checagem no Editor: Checklist Resolve

Após importar o arquivo na timeline do DaVinci Resolve, executar esta checklist completa:

### 1. Conversão de framerate solicitada?

**Ação**: Importar file na timeline nova e observar diálogo de warning.

**Resultado esperado**: ✅ Nenhum diálogo pedindo conversão de frame rate.

Se aparecer diálogo:
- ❌ **Problema**: FPS do file ≠ FPS da timeline project
- 🔧 **Solução**: Ajustar timeline project fps para coincidir com FPS de AudioSyncMap.ts (geralmente 30)
- ⚠️ **Cuidado**: Nunca converter durante ingestão, sempre alinhar timelines primeiro

### 2. Nitidez mantida a 100% zoom

**Ação**: Zoom na timeline para 100%, observar textos finos e conectores SVG.

**Resultado esperado**: ✅ Texto fino legível, linhas finas nítidas sem borrões.

Se falhar:
- ❌ **Problema**: Resolucao insuficiente, blurring durante encode, fonte mal carregada
- 🔧 **Solução**: Reduzir bitrate, aumentar CRF quality, confirmar fonts carregadas via @remotion/google-fonts
- 💡 **Teste adicional**: Render 4K (--scale=2) e downsample para 1080p, melhorar nitidez percebida

### 3. Cores batem com Studio

**Ação**: Comparar cores de elements chave no Viewer do Resolve vs Studio browser.

**Resultado esperado**: ✅ Tons idênticos, mesmo gamma/brightness.

Se divergir:
- ❌ **Problema**: color space mismatch, gamma profile inconsistente
- 🔧 **Solução**: Confirmar --color-space=bt709 aplicado tanto no render quanto no project settings do Resolve
- 📝 **Nota**: BT.709 é padrão HDMI/HD, Resolve interpreta automaticamente quando flag presente

### 4. Animação sincronizada com narração final

**Ação**: Play da timeline observando ponto exato entrada do clipe (primeiro sample de audio).

**Resultado esperado**: ✅ Eventos visuais começam exatamente LEAD_FRAMES antes palavras vocalizadas.

Se dessincronizado:
- ❌ **Problema**: AudioSyncMap.sec values errados, durationInFrames calculado incorretamente, lead frames não aplicado
- 🔧 **Solução**: Regenerar cues.json se áudio regravado, ajustar secToFrame calculations, revisar LEAD_FRAMES constant
- 🔍 **Debug**: Medir offset em frames usando waveform display do Resolve (cada sample ≈0,02ms a 48kHz)

### 5. Alpha clean sem halo (para perfil alpha)

**Ação**: Colocar master-alpha.mov sobre clip de background (video ou imagem colorida forte).

**Resultado esperado**: ✅ Bordas dos elementos gráficos limpas, sem border branco/preto residual ("halo").

Se halo visível:
- ❌ **Problema**: Alpha channel mal exportado, background sólido acidental, compressão ProRes excessiva
- 🔧 **Solução**: Verificar composition tem background transparente real, usar prores-profile=4444-xq (mais bits alpha), garantir image-format=png
- 🧪 **Teste**: Overlay sobre gradient vermelho→azul extremo para revelar halos sutis

## Perfil de Concorrência e Benchmark GPU

### Script de benchmark automático

```bash
#!/bin/bash
# scripts/benchmark-gpu.sh

FRAMES="0-120"  # test 4 seconds = 120 frames @30fps

echo "⚙️ Benchmarking hardware acceleration options..."
echo "Rendering $FRAMES frames with different concurrency levels..."

for CONCURRENCY in 1 2 4 8; do
  START=$(date +%s.%N)
  npx remotion render Master /tmp/bench-c$CONCURRENCY.mp4 \
    --frames=$FRAMES \
    --concurrency=$CONCURRENCY \
    --hardware-acceleration=if-possible 2>&1 | grep -E "(Rendered|Finished)"
  END=$(date +%s.%N)
  
  DURATION=$(echo "$END - $START" | bc)
  FPS_PER_SEC=$(echo "scale=2; $FRAMES / $DURATION" | bc)
  
  echo "Concurrency $CONCURRENCY: $DURATIONs for $FRAMES frames = $FPS_PER_SEC frames/sec"
done

echo "✅ Benchmark completo. Registre melhor valor no DECISIONS.md"
```

**Interpretação**:

- Se ganho marginal <20% entre concorrências adjacentes: CPU bottleneck (filtros heavy, complex DOM)
- Se ganho significativo >40%: CPU limitado, aumentar concurrency até saturar
- Se tempo estável independente de concurrency: GPU bottleneck (WebGL, CSS 3D transforms), tentar `--gl=angle`

**Registros no DECISIONS.md**:

```markdown
## Render
- Perfil: master · Concorrência ótima: 8 threads (ganho marginal <15% acima disso)
- Tempo de render total: 24 min para 45s video (1920×1080, 30fps)
- GPU ajudou: SIM (+35% speedup com hardware-acceleration=if-possible vs disable)
- Melhor performance GPU detectada: NVIDIA Quadro P2000 (Windows)
```

## Importação no Resolve: Fluxo Completo

### Passo a passo recomendado

1. **Criar novo projeto**: File → New Project → Nome claro (ex: "Animation_Explainer_ConsoleAPI_Windows")
2. **Configurar timeline**: Right-click timeline → Timeline Settings → Set resolution 1920×1080, fps 30, pixel format Rec.709
3. **Importar assets**: Media Pool → Import Files → Selecionar out/master.mp4 E public/narracao.wav (se não muted)
4. **Arrastar video para timeline**: Clip master.mp4 para track V1 (principal video track)
5. **Verificar sincronização**: Expand waveform de audio, comparar picos com transições visuais
6. **Ajustar posicionamento**: Se necessário, deslizar clip ligeiramente left/right para perfect sync
7. **Exportar final**: Share → Add to Render Queue → Format H.264/ProRes → Export

### Dicas profissionais

- **Proxy workflow**: Para machine lenta, criar proxies temporários (mediobunny proxy generator)
- **LUT color correction**: Aplicar LUT personalizada para manter branding consistente entre varias animações
- **Multi-cam setup**: Se varias versões de mesma cena comparadas, organizar como multi-cam clips
- **Audio ducking**: Automatizar volume drop de background music quando narração ocorre (sidechain compressor no Fairlight page)
- **Titling extra**: Adicionar credits ou lower thirds adicionais via Fusion templates do Resolve

## Troubleshooting Comum

### Problema: Resolve converte framerate automáticamente

**Causa**: FPS da timeline não coincide com FPS do file importado.

**Solução**:
1. Verificar FPS do video: `ffprobe ... stream=r_frame_rate`
2. Editar timeline settings: Right-click → Timeline Settings → Change frame rate
3. Escolher FPS igual ao do video (geralmente 30)
4. Remover e re-importar se necessário

### Problema: Cores saturadas demais ou lavadas

**Causa**: Gamma/profile mismatch entre render e decode.

**Solução**:
1. Confirmar --color-space=bt709 no render command
2. Em Resolve: Project Settings → Color Management → DaVinci YRGB → Rec.709
3. Check "Gamma correction" off se cores muito lavadas

### Problema: Textos pixelados ou ilegíveis

**Causa**: Font loading falhou ou blur durante encode.

**Solução**:
1. Confimar fontes carregadas via loadFont().waitUntilDone() antes render
2. Aumentar CRF quality (≤16 recommended, ≤12 ultra high quality)
3. Considerar render 4K (--scale=2) e downsample para 1080p
4. Verificar token.fontSize labels ≥28px, body ≥36px

### Problema: Halos nas bordas do alpha

**Causa**: Alpha mal gerado, talvez background solid present.

**Solução**:
1. No Studio, ativar checkerboard transparent background
2. Confirmar AbsoluteFill sem backgroundColor style
3. Render alpha novamente com --prores-profile=4444-xq
4. Em Fusion node editor do Resolve, adicionar "Delta Keyer" para limpar alpha edges

