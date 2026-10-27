# Briefing Pedagógico - [NOME DO PROJETO]

Este documento captura objetivos, hipóteses e especificações pedagógicas da animação explicativa antes de começar implementação técnica.

## Informações Básicas

| Campo | Valor |
|-------|-------|
| Tema Central | [Ex: Como chamadas de sistema console são traduzidas para API Windows numa recompilação estática] |
| Público-Alvo | [Ex: Desenvolvedores iniciantes em sistemas operacionais] |
| Nível de Conhecimento Prévio | [Ex: Familiar com programação básica, mas não com APIs de baixo nível] |
| Duração Alvo | [Ex: 60-90 segundos] |
| FPS da Timeline Resolve | [Ex: 30 fps - confirmar com criador] |
| Resolução | [Ex: 1920×1080 (HD)] |
| Idioma Texto na Tela | [Ex: PT-BR] |
| Estado Narração | [Ex: Roteiro aprovado / Áudio gravado pendente / Estimado manual] |
| Referências Visuais | [Lista de links/screenshots fornecidos pelo usuário] |

---

## Objetivo Pedagógico Mensurável

**Ao final desta animação, o espectador conseguirá explicar:**

> "[Descrever habilidade/conceito mensurável em uma frase completa]"

**Exemplo**: "Ao final, o espectador consegue explicar como uma chamada de sistema do console vira uma chamada da API do Windows durante recompilação estática."

---

## Equívoco Principal a Desfazer

**O que o público costuma achar errado sobre este tema:**

> "[Descrever conceito errado mais comum]"

**Exemplo**: "Muitos acham que programas compilados 'sabem' qual API usar automaticamente, sem precisar recompilar."

**Estratégia de correção**: Mostrar visualmente código fonte→output binário com tradução explícita na transição.

---

## Máquina de Estados Visuais

Cada linha representa UM beat (ideia única respondendo pergunta específica do espectador).

| Beat | Estado Inicial | Evento / Transformação | Estado Final | Elementos Novos (≤4) | Frase da Narração | Duração (s) |
|------|----------------|------------------------|--------------|----------------------|-------------------|-------------|
| 1 | Tela preta → texto aparece | Fade-in título + subtítulo | Título legível | 2: título, subtítulo | "Olá, hoje veremos recompilação" | max(1.2, 6÷3.5)=1.7 |
| 2 | Programa C rodando no console | Cursor digita "hello" | Texto completo exibido | 3: prompt, cursor, texto, output box | "Você escreve um programa simples" | max(1.2, 5÷3.5)=1.5 |
| 3 | Output mostra string | Highlight na palavra "write()" | word destacado pulsando | 2: highlight, pulsar animation | "Ao chamar write(), o console intercepta" | max(1.2, 6÷3.5)=1.7 |
| ... | ... | ... | ... | ... | ... | ... |

**Duração total calculada**: Soma das durações = ~[XX]s

**Duration frames totais**: round([XX] × 30fps) = [YY] frames

---

## Premissas Assumidas

Valores usados quando criador não respondeu ou não havia informação disponível:

1. **FPS padrão assumido**: 30 fps (confirme com timeline do Resolve)
2. **Velocidade narração estimada**: 2,5 palavras/segundo (PT-BR médio)
3. **Cores primárias propostas**: Azul (#5867f0), Verde (#4ade80) baseados em design system padrão
4. **Fontes escolhidas**: Inter (sans-serif geométrica), JetBrains Mono (monoespaçada)
5. **Transições preferidas**: springs SNAPPY para interface, SMOOTH para fade-ins
6. **Outras premissas**: [Listar qualquer outra suposição tomada]

---

## Decisões Pendentes

Itens que precisam confirmação do criador antes prosseguir para Etapa 2 (piloto):

- [ ] Confirmação de FPS da timeline do Resolve
- [ ] Preferência de ritmo (pausado/moderado/rápido)
- [ ] Preferência de densidade (leve/texto/denso textual)
- [ ] Aprovação de paleta de cores proposta
- [ ] Disponibilidade de áudio gravado ou usar estimado manual

---

## Checklist Pré-Piloto

Antes de codificar PilotoComposition.tsx, validar:

- [ ] Objetivos pedagógicos claros e mensuráveis definidos
- [ ] Máquina de estados visuais completa com todos beats mapeados
- [ ] Duração total calculada e coerente com objetivo narrativo
- [ ] Todas premissas documentadas acima
- [ ] Decisões pendentes resolvidas ou registradas como assumir padrões

---

*Documento criado em [data] • Próxima revisão após CP1 (aprovado piloto)*

