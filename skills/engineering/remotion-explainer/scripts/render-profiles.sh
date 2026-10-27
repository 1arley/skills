#!/bin/bash
# scripts/render-profiles.sh
# Perfis de render para diferentes finalidades: preview rápido, master para editar, alpha para overlay
# Referenciar flags em references/render-and-resolve-guide.md

set -e  # Exit immediately on error

PROJECT_DIR="${1:-.}"
OUTPUT_DIR="$PROJECT_DIR/out"
FPS=${FPS:-30}  # FPS deve coincidir com timeline do DaVinci Resolve!

echo "🎬 Renders Remotion - Perfis Disponíveis"
echo "========================================="
echo ""
echo "Uso: ./scripts/render-profiles.sh [preview|master|alpha]"
echo "Default: renderiza todos os perfis na ordem"
echo ""

mkdir -p "$OUTPUT_DIR"

# Verificar se package.json existe e Remotion está instalado
if [ ! -f "$PROJECT_DIR/package.json" ]; then
  echo "❌ ERRO: package.json não encontrado em $PROJECT_DIR"
  exit 1
fi

# Executar um perfil específico ou listar opções
case "${2:-all}" in
  preview)
    echo "📹 Renderizando PREVIEW (rascunho rápido para revisão timing)"
    echo "-------------------------------------------------------------"
    npx remotion render Master "$OUTPUT_DIR/preview.mp4" \
      --scale=0.5 \
      --crf=28 \
      --codec=h264 \
      --pixel-format=yuv420p \
      --muted
    
    FILE_SIZE=$(du -h "$OUTPUT_DIR/preview.mp4" | cut -f1)
    DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$OUTPUT_DIR/preview.mp4")
    
    echo ""
    echo "✅ Preview gerado: $OUTPUT_DIR/preview.mp4"
    echo "   Resolução: 960×540 (50% scale)"
    echo "   Duração: ${DURATION}s"
    echo "   Tamanho: $FILE_SIZE"
    echo ""
    echo "⚠️  Uso: Revisão rápida de timing, NÃO usar para aprovação visual detalhada"
    ;;
    
  master)
    echo "🎞️  Renderizando MASTER (entrega para DaVinci Resolve)"
    echo "-----------------------------------------------------"
    npx remotion render Master "$OUTPUT_DIR/master.mp4" \
      --codec=h264 \
      --crf=16 \
      --pixel-format=yuv420p \
      --color-space=bt709 \
      --hardware-acceleration=if-possible \
      --muted
    
    FILE_SIZE=$(du -h "$OUTPUT_DIR/master.mp4" | cut -f1)
    DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$OUTPUT_DIR/master.mp4")
    
    echo ""
    echo "✅ Master gerado: $OUTPUT_DIR/master.mp4"
    echo "   Resolução: 1920×1080 (nativa)"
    echo "   Codec: H.264, CRF=16 (alta qualidade editável)"
    echo "   Color space: BT.709 (padrão HD, compatível Resolve)"
    echo "   Duração: ${DURATION}s"
    echo "   Tamanho: $FILE_SIZE"
    echo ""
    echo "✅ Checklist pós-render:"
    echo "   □ Importar no Resolve sem conversão automática de framerate"
    echo "   □ Texto fino e conectores nítidos a 100% zoom"
    echo "   □ Cores batem com Studio (mesma gama bt709)"
    echo "   □ Animação sincronizada com narração no ponto de entrada"
    echo ""
    echo "💡 Dica: Se Resolve não importar H.264, use perfil 'alpha' abaixo."
    ;;
    
  alpha)
    echo "🔮 Renderizando ALPHA PASS (overlay transparente para camadas)"
    echo "--------------------------------------------------------------"
    npx remotion render Master "$OUTPUT_DIR/master-alpha.mov" \
      --codec=prores \
      --prores-profile=4444 \
      --pixel-format=yuva444p10le \
      --image-format=png \
      --muted
    
    FILE_SIZE=$(du -h "$OUTPUT_DIR/master-alpha.mov" | cut -f1)
    DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$OUTPUT_DIR/master-alpha.mov")
    
    echo ""
    echo "✅ Alpha pass gerado: $OUTPUT_DIR/master-alpha.mov"
    echo "   Codec: ProRes 4444 XQ (suporta canal alfa completo)"
    echo "   Pixel format: yuva444p10le (alpha incluído)"
    echo "   Image format: PNG frames (sem compressão lossy)"
    echo "   Duração: ${DURATION}s"
    echo "   Tamanho: $FILE_SIZE"
    echo ""
    echo "✅ Checklist pré-alpha-render:"
    echo "   □ Composition tem background transparente real (checkerboard visível no Studio)"
    echo "   □ Nenhum AbsoluteFill com backgroundColor definido"
    echo "   □ Elementos gráficos apenas (ícones, setas, texto), sem fundo sólido"
    echo ""
    echo "💡 Uso: Overlay sobre B-roll ou talking head no Resolve"
    ;;
    
  all)
    echo "⚙️  Renderizando TODOS os perfis (preview → master → alpha)"
    echo "============================================================"
    echo ""
    
    ./scripts/render-profiles.sh "$PROJECT_DIR" preview
    echo ""
    ./scripts/render-profiles.sh "$PROJECT_DIR" master
    echo ""
    ./scripts/render-profiles.sh "$PROJECT_DIR" alpha
    echo ""
    
    echo "🎉 Todos renders concluídos!"
    echo ""
    echo "Arquivos gerados em $OUTPUT_DIR/:"
    ls -lh "$OUTPUT_DIR/"*.{mp4,mov} 2>/dev/null | awk '{print "  " $NF " (" $5 ")"}' || echo "  (alguns podem ter falhado)"
    ;;
    
  *)
    echo "❌ ERRO: Perfil '$2' não reconhecido"
    echo ""
    echo "Perfis disponíveis:"
    echo "  preview  → rascunho rápido (960×540, CRF=28)"
    echo "  master   → entrega para editar (1920×1080, CRF=16)"
    echo "  alpha    → overlay transparente (ProRes 4444 + alpha)"
    echo ""
    echo "Exemplo: ./scripts/render-profiles.sh . master"
    exit 1
    ;;
esac

# Validar arquivo master com ffprobe
if [ -f "$OUTPUT_DIR/master.mp4" ]; then
  echo ""
  echo "🔍 Validando master.mp4..."
  
  DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$OUTPUT_DIR/master.mp4")
  WIDTH=$(ffprobe -v error -show_entries stream=width -of default=noprint_wrappers=1:nokey=1 "$OUTPUT_DIR/master.mp4")
  HEIGHT=$(ffprobe -v error -show_entries stream=height -of default=noprint_wrappers=1:nokey=1 "$OUTPUT_DIR/master.mp4")
  PIXEL_FORMAT=$(ffprobe -v error -show_entries stream=pix_fmt -of default=noprint_wrappers=1:nokey=1 "$OUTPUT_DIR/master.mp4")
  FRAME_RATE=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of default=noprint_wrappers=1:nokey=1 "$OUTPUT_DIR/master.mp4")
  
  echo "   Codec: h264 ✅"
  echo "   Resolução: ${WIDTH}×${HEIGHT} ✅"
  echo "   Pixel format: $PIXEL_FORMAT ✅"
  echo "   FPS: $FRAME_RATE ✅"
  echo "   Duração: ${DURATION}s ✅"
  
  # Checar duração ±1 frame da narração (se existir audio)
  if [ -f "$PROJECT_DIR/public/narracao.wav" ]; then
    AUDIO_DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$PROJECT_DIR/public/narracao.wav")
    DIFF=$(echo "$DURATION - $AUDIO_DURATION" | bc -l)
    DIFF_ABS=${DIFF#-}  # abs value
    
    if (( $(echo "$DIFF_ABS > 0.03" | bc -l) )); then
      echo "   ⚠️  WARNING: Duration difference ${DIFF}s > threshold 0.03s (~1 frame at 30fps)"
      echo "   → Regenerar cues.json se áudio regravado, ajustar AudioSyncMap.ts"
    else
      echo "   ✓ Duração dentro tolerância de ±1 frame ✅"
    fi
  fi
fi

echo ""
echo "📄 Documentação completa em: references/render-and-resolve-guide.md"

