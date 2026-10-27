# DECISIONS: [TÍTULO DO VÍDEO] ([DATA])

Este documento registra decisões tomadas durante desenvolvimento da animação explicativa. Será lido automaticamente na Etapa 0 do próximo projeto para reaproveitamento de soluções.

## Objetivo Pedagógico

**O que o espectador deve entender**:
> [Descrever habilidade/conceito mensurável]

**Equívoco desfeito**:
> [Conceito errado corrigido pela animação]

---

## Variação Escolhida

### Seleção Final

- **Escolhida**: [VarA_FluxoLinear / VarB_ComparacaoParalela / etc.]
- **Nota ponderada**: [X.X / 5.0]
- **Por que funcionou melhor pedagogicamente**: [Explicar decisão baseado em rubrica]

### Descartadas e Porquê

| Variação | Nota | Motivo descarte |
|----------|------|-----------------|
| VarB_ComparacaoParalela | 3.7 | Ritmo não acompanhou narração (2.5) |
| VarC_ZoomHierarquico | 3.8 | Duração excessiva (ultrapassou alvo de 60s) |
| VarD_MinimalistaFoco | 3.2 | Fidelidade técnica insuficiente (perdeu detalhes API names) |

---

## Física e Timing

### Springs Usados

| Preset | damping | stiffness | mass | Onde foi usado |
|--------|---------|-----------|------|----------------|
| SPRING_SNAPPY | 20 | 200 | 0.8 | NodeBox state transition |
| SPRING_SMOOTH | 200 | 200 | 1 | AnimatedArrow path drawing |
| SPRING_BOUNCY | 8 | 150 | 0.5 | Success badge appearance |

### Durações Padrão

- Entrada de elemento: **[X]s** → **[Y] frames** @ [FPS]fps
- Stagger entre elementos: **[X]s** → **[Y] frames**
- Antecipação visual (LEAD): **[X]s** = [Y] frames antes palavra vocalizada
- Tempo mínimo de leitura: **max(1.2s, palavras÷3.5)**

---

## Componentes Novos Promovidos ao Design System Global

Lista de componentes criados nesta animação que devem ser copiados para design system global (`~/.claude/skills/global-design-system/components/`):

1. **NomeDoComponente.tsx** - [Descrição curta de propósito e quando reutilizar]
   - Caminho atual: `src/design-system/components/NameDoComponente.tsx`
   - Proposta: copiar para `global-design-system/components/NameDoComponente.tsx`

2. ... mais componentes

---

## Soluções Visuais Reaproveitáveis

Padrões visuais validados que podem servir como referência futura:

1. **Problema**: [O que era difícil]
   **Solução**: [Como resolveu]
   **Reutilizável em**: [Quais tipos de cenas futuras se beneficiam]

2. ... mais soluções

---

## Problemas e Armadilhas Encontrados

| Problema | Causa Raiz | Solução Aplicada | Linha do Arquivo |
|----------|------------|------------------|------------------|
| [Ex: Textos cortados nas bordas] | Margem segura não aplicada | Aumentar padding interno para SPACING.marginSafe (96px) | Root.template.tsx:45 |
| [Ex: FPS inconsistente] | Hardcoded 60fps em Sequence, mas composition usa 30fps | Extrair FPS de AudioSyncMap.ts e usar em todos cálculos | src/beats/beat02.tsx:12 |
| ... | ... | ... | ... |

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
- **Concorrência ótima**: [N] threads (benchmark executado em scripts/benchmark-gpu.sh)
- **Tempo total de render**: [X] min [Y] seg
- **GPU ajudou**: SIM / NÃO (+[Z]% speedup vs software only)

### Validação ffprobe

```bash
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 out/master.mp4
# Saída: [XX.XX] segundos (±[YY] frame(s) do audio: [ZZ.ZZ]s) ✅
```

---

## Premissas Assumidas

Valores padronizados usados quando criador não forneceu informação específica:

1. FPS = 30 (padrão Resolve HD)
2. Velocidade narração PT-BR = 2,5 palavras/segundo
3. Paleta semântica azul→verde conforme design system padrão
4. Fontes Inter + JetBrains Mono baseadas em melhores práticas do ecossistema Remotion
5. Outro padrão assumido: [detalhar]

---

*Documento atualizado em [data] por [nome/agente]*

