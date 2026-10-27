#!/bin/bash
# scripts/log-decisions.sh
# Cria ou atualiza DECISIONS.md na raiz do projeto
# Segue formato definido em templates/DECISIONS.template.md

set -e  # Exit immediately on error

PROJECT_DIR="${1:-.}"
DECISIONS_FILE="$PROJECT_DIR/DECISIONS.md"
DATA=$(date +"%Y-%m-%d")

echo "📝 Atualizando DECISIONS.md..."
echo "=============================="

# Extrair informações básicas do projeto
if [ ! -f "$PROJECT_DIR/package.json" ]; then
  echo "❌ ERRO: package.json não encontrado em $PROJECT_DIR"
  exit 1
fi

if [ ! -f "$PROJECT_DIR/templates/BRIEF.template.md" ]; then
  echo "⚠️  WARNING: BRIEF.template.md não encontrado. Decisão 'Objetivo Pedagógico' será vazia."
fi

# Perguntar ao usuário (ou usar defaults automáticos)
read -p "Título do vídeo/projeto: " VIDEO_TITLE
VIDEO_TITLE=${VIDEO_TITLE:-"Projeto Sem Título"}

read -p "Objetivo pedagógico (ao final, espectador consegue explicar...): " OBJECTIVE
OBJECTIVE=${OBJECTIVE:-"[A definir]"}

read -p "Equívoco principal desfeito: " EQUÍVOCO
EQUÍVOCO=${EQUÍVOCO:-"[A definir]"}

read -p "Variação escolhida (VarA/VarB/VarC/VarD ou personalizada): " VAR_CHOSEN
VAR_CHOSEN=${VAR_CHOSEN:-"Não definida"}

read -p "Nota ponderada da variação (X.X de 5.0): " VAR_SCORE
VAR_SCORE=${VAR_SCORE:-"N/A"}

read -p "Por que funcionou melhor pedagogicamente: " REASON
REASON=${REASON:-"[Justificativa pendente]"}

read -p "Componentes novos promovidos ao design system global: " COMPONENTS_PROMOTED
COMPONENTS_PROMOTED=${COMPONENTS_PROMOTED:-"Nenhum"]

read -p "Problemas enfrentados e soluções (lista separada por vírgula): " PROBLEMS_SOLUTIONS
PROBLEMS_SOLUTIONS=${PROBLEMS_SOLUTIONS:-"Nenhum problema significativo"]

read -p "Tempo total de render (ex: 24 min): " RENDER_TIME
RENDER_TIME=${RENDER_TIME:-"A definir"}

read -p "GPU ajudou na aceleração? (SIM/NÃO): " GPU_HELP
GPU_HELP=${GPU_HELP:-"SIM"}

# Gerar conteúdo DECISIONS.md
cat > "$DECISIONS_FILE" <<EOF
# DECISIONS: $VIDEO_TITLE ($DATA)

Este documento registra decisões tomadas durante desenvolvimento da animação explicativa. Será lido automaticamente na Etapa 0 do próximo projeto para reaproveitamento de soluções.

## Objetivo Pedagógico

**O que o espectador deve entender**:
> $OBJECTIVE

**Equívoco desfeito**:
> $EQUÍVOCA

---

## Variação Escolhida

### Seleção Final

- **Escolhida**: $VAR_CHOSEN
- **Nota ponderada**: $VAR_SCORE / 5.0
- **Por que funcionou melhor pedagogicamente**: $REASON

### Descartadas e Porquê

| Variação | Nota | Motivo descarte |
|----------|------|-----------------|
| VarB_ComparacaoParalela | TBD | Ritmo não acompanhou narração |
| VarC_ZoomHierarquico | TBD | Duração excessiva |
| VarD_MinimalistaFoco | TBD | Fidelidade técnica insuficiente |

*Preencher com dados reais após aplicação da rubrica (references/variations-rubric.md)*

---

## Física e Timing

### Springs Usados

| Preset | damping | stiffness | mass | Onde foi usado |
|--------|---------|-----------|------|----------------|
| SPRING_SNAPPY | 20 | 200 | 0.8 | NodeBox state transition |
| SPRING_SMOOTH | 200 | 200 | 1 | AnimatedArrow path drawing |
| SPRING_BOUNCY | 8 | 150 | 0.5 | Success badge appearance |

*Deduzir valores finais de src/design-system/springs.ts*

### Durações Padrão

- Entrada de elemento: **[X]s** → **[Y] frames** @ FPS
- Stagger entre elementos: **[X]s** → **[Y] frames**
- Antecipação visual (LEAD): **0.12s = 4 frames** antes palavra vocalizada
- Tempo mínimo de leitura: **max(1.2s, palavras÷3.5)**

---

## Componentes Novos Promovidos ao Design System Global

$([ "$COMPONENTS_PROMOTED" == "Nenhum" ] && echo "Nenhum componente novo neste projeto." || echo "- $COMPONENTS_PROMOTED")

*Copiar estes componentes para `global-design-system/components/` no próximo projeto*

---

## Soluções Visuais Reaproveitáveis

1. Problema: [descrever]  
   **Solução**: [como resolveu]  
   **Reutilizável em**: [quais tipos futuros se beneficiam]

2. ... mais soluções

*Listar padrões visuais validados nesta animação que servirão como referência futura*

---

## Problemas e Armadilhas Encontrados

$PROBLEMS_SOLUTIONS

*Causa raiz + solução aplicada para cada item listado acima*

---

## Render

### Configuração Usada

- **Perfil**: preview / master / alpha
- **Flags CLI**: 
  ```bash
  npx remotion render Master out/master.mp4 \
    --codec=h264 --crf=16 --pixel-format=yuv420p --color-space=bt709 \
    --hardware-acceleration=if-possible --muted
  ```
- **Concorrência ótima**: TBD threads
- **Tempo total de render**: $RENDER_TIME
- **GPU ajudou**: $GPU_HELP (+Z% speedup vs software only)

### Validação ffprobe

```bash
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 out/master.mp4
# Saída: TBD segundos (±frame(s) do audio) ✅
```

---

## Premissas Assumidas

Valores padronizados usados quando criador não forneceu informação específica:

1. FPS = 30 (padrão Resolve HD)
2. Velocidade narração PT-BR = 2,5 palavras/segundo
3. Paleta semântica azul→verde conforme design system padrão
4. Fontes Inter + JetBrains Mono baseadas em melhores práticas do ecossistema Remotion
5. Outro padrão assumido: TBD

---

*Documento atualizado em $DATA por agent*
EOF

echo ""
echo "✅ DECISIONS.md criado/atualizado em: $DECISIONS_FILE"
echo ""
echo "📋 Estrutura preenchida:"
echo "   ✓ Objetivo pedagógico: $OBJECTIVE"
echo "   ✓ Equívoco desfeito: $EQUÍVOCO"
echo "   ✓ Variação escolhida: $VAR_CHOSEN"
echo "   ✓ Componentes promovidos: $COMPONENTS_PROMOTED"
echo "   ✓ Render time: $RENDER_TIME"
echo "   ✓ GPU ajuda: $GPU_HELP"
echo ""
echo "📖 Consulte templates/DECISIONS.template.md para estrutura completa"
echo ""

