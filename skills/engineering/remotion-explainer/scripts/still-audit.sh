#!/bin/bash
# scripts/still-audit.sh
# Audita Still Frames nos momentos-chave para revisão visual antes de checkpoints
# Renderiza imagens nos frames: início/fim de cada beat, meio da transição, frame de cada cue

set -e  # Exit immediately on error

PROJECT_DIR="${1:-.}"
OUTPUT_DIR="$PROJECT_DIR/out/audit"
FPS=30  # Padrão, pode ser sobrescrito via ENVIRONMENT

echo "🔍 Auditando still frames..."
echo "============================="

# Criar diretório de output
mkdir -p "$OUTPUT_DIR"

# Função auxiliar: render still frame
render_still() {
  local comp_name="$1"
  local frame_num="$2"
  local output_file="$3"
  
  echo "   Rendering still for $comp_name at frame $frame_num → $output_file"
  npx remotion still "$comp_name" --frame="$frame_num" --output="$output_file" 2>/dev/null || {
    echo "     ⚠️  Falha ao renderizar still (composição não existe ou erro no template)"
    return 1
  }
}

# Lista de compositions a auditar
COMPOSITIONS=(
  "PilotComposition"
  "VarA_FluxoLinear"
  "VarB_ComparacaoParalela"
  "Master-Syncronizado"
)

# Definir beats baseados na duração total estimada (substituir após calcular em BRIEF.md)
TOTAL_BEATS=5
BEAT_DURATION_SECONDS=3
TOTAL_DURATIONS=$((TOTAL_BEATS * BEAT_DURATION_SECONDS))
START_FRAME=0
END_FRAME=$((TOTAL_DURATIONS * FPS))

echo ""
echo "Beats definidos: $TOTAL_BEATS × ${BEAT_DURATION_SECONDS}s = ${TOTAL_DURATIONS}s (${END_FRAME} frames @${FPS}fps)"
echo ""

# Gerar stills para cada composição
for comp in "${COMPOSITIONS[@]}"; do
  echo "📸 Composição: $comp"
  
  # Frame inicial (beat 1)
  render_still "$comp" $START_FRAME "$OUTPUT_DIR/${comp}-start.png" && echo "     ✓ Início"
  
  # Frame final (último beat)
  render_still "$comp" $((END_FRAME - 1)) "$OUTPUT_DIR/${comp}-end.png" && echo "     ✓ Fim"
  
  # Meios de transições importantes (ex: beat 2→3, 3→4)
  mid_frame=$(( (BEAT_DURATION_SECONDS * FPS * 2) + 9 ))  # ~2.5s dentro beat 2
  render_still "$comp" $mid_frame "$OUTPUT_DIR/${comp}-mid-trans1.png" 2>/dev/null && echo "     ✓ Transição 1"
  
  mid_frame=$(( (BEAT_DURATION_SECONDS * FPS * 3) + 9 ))  # ~2.5s dentro beat 3
  render_still "$comp" $mid_frame "$OUTPUT_DIR/${comp}-mid-trans2.png" 2>/dev/null && echo "     ✓ Transição 2"
  
  # Cues críticos (extraídos de AudioSyncMap.ts manualmente aqui)
  # Exemplo hardcoded – idealmente ler cues.json dinamicamente
  cue_0_sec=0
  cue_7sec=$((7 * FPS))
  cue_12sec=$((12 * FPS))
  
  render_still "$comp" $cue_0_sec "$OUTPUT_DIR/${comp}-cue-intro.png" 2>/dev/null && echo "     ✓ Cue intro"
  render_still "$comp" $cue_7sec "$OUTPUT_DIR/${comp}-cue-mid.png" 2>/dev/null && echo "     ✓ Cue meio"
  render_still "$comp" $cue_12sec "$OUTPUT_DIR/${comp}-cue-end.png" 2>/dev/null && echo "     ✓ Cue fim"
  
  echo ""
done

echo "✅ Auditoria concluída! Imagens salvas em: $OUTPUT_DIR/"
echo ""
echo "📋 Checklist visual para revisar:"
echo "   □ Texto não cortado nas bordas (margem segura 96px preservada)"
echo "   □ Sobreposição de elementos ausente"
echo "   □ Conexões legíveis (setas com rótulos, sem cruzar textos)"
echo "   ✓ Contraste adequado (corpo ≥36px, labels ≥28px)"
echo "   ✓ Alinhamento ao grid consistente entre cenas"
echo ""
echo "🖼  Abra as imagens para inspeção manual:"
for img in "$OUTPUT_DIR"/*.png; do
  if [ -f "$img" ]; then
    echo "   $img"
  fi
done

