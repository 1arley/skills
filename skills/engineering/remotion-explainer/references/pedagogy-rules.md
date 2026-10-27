# Regras Pedagógicas para Animações Explicativas

Esta documentação define regras de carga cognitiva, tempo de leitura e testes de validação para garantir que animações sejam didaticamente eficazes.

## Carga Cognitiva

### Princípio fundamental
**Uma ideia por cena.** Cada beat da máquina de estados visuais deve responder a uma única pergunta do espectador.

### Limites quantitativos

- **Elementos novos por beat**: máximo 4 elementos (não contados: fundo, cores de superfície, elementos já aparecidos em beats anteriores)
- **Texto na tela por elemento**: rótulos de 1-4 palavras, frases completas de até 12 palavras
- **Movimentos simultâneos principais**: no máximo 1 elemento em movimento principal por vez; o resto usa FocusDim (opacidade reduzida)
- **Cores de destaque por cena**: máximo 3 cores distintas, cada uma com significado semântico fixo (ex: azul = conceito novo, laranja = transformação, verde = sucesso/completo)

### Estratégias de redução de carga cognitiva

1. **Progressive disclosure**: revelar elementos em sequência temporal, não todos de uma vez
2. **Antecipação visual com lead frames**: evento acontece LEAD_FRAMES antes da palavra vocalizada (0,12s = 12 frames a 30fps)
3. **Respiro entre beats**: mínimo 0,15s após término de um beat antes iniciar próximo
4. **Stagger entre elementos relacionados**: 0,2s de delay entre entrada sequencial de grupos conectados
5. **Foco único**: usar FocusDim para reduzir opacidade de elementos secundários quando focar um ativo
6. **Hierarquia visual clara**: tamanho maior → importância maior; posição superior → anterioridade temporal

### Padrões validados de organização

Ver references/pedagogical-patterns.md para padrões específicos (fluxo de dados, comparação lado a lado, isolamento de camadas, zoom hierárquico).

## Tempo de Leitura

### Fórmula base

Duração mínima de um beat = max(1,2 segundos, númeroDePalavrasNaTela ÷ 3,5).

**Justificativa**: Estudos de eye-tracking indicam que público geral lê aproximadamente 3,5 palavras por segundo em telas com bom contraste e tipografia legível. O piso de 1,2s garante tempo mínimo mesmo para frases curtas.

### Aplicações práticas

```typescript
// Exemplo: cálculo de duração mínima por beat
const PALAVRAS_POR_SEGUNDO = 3.5;

function calcularDuracaoMinima(palavrasNaTela: number): number {
  const peloLeitura = palavrasNaTela / PALAVRAS_POR_SEGUNDO;
  return Math.max(1.2, peloLeitura); // sempre ≥ 1,2s
}

// Usado em BRIEF.md ao definir máquina de estados visuais:
// | Beat 3 | Estado inicial: API chama console | Evento: recompilação | Estado final: API Windows | 
//   Frase: "A recompilação traduz chamadas" | Duração: max(1,2, 4÷3,5) = 1,2s ✓
```

### Conversão para frames

Converta segundos para frames baseado no FPS da timeline do Resolve:

```typescript
// src/design-system/timing.ts
export const FPS = 30; // ou valor definido pelo usuário
export const secToFrame = (sec: number) => Math.round(sec * FPS);

// Exemplos:
// Entrada elemento (0,6s) → 18 frames a 30fps
// Stagger (0,2s) → 6 frames
// Antecipação (0,12s) → 4 frames
// Duracão mínima (1,2s) → 36 frames
```

### Valores padrão de duração

| Ação | Duração (s) | Frames (30fps) | Uso |
|------|-------------|----------------|-----|
| Entrada elemento | 0,6 | 18 | spring() para aparecer |
| Stagger entre grupo | 0,2 | 6 | delay entre siblings |
| Antecipação vocal | 0,12 | 4 | lead frames antes cue |
| Pausa beat a beat | 0,15 | 5 | respiro entre ideias |
| Transição estado | 0,8 | 24 | estado A → B completo |

## Teste dos 5 Segundos

### Objetivo
Validar se uma cena comunica sua ideia central sem narração, apenas observando um frame-chave.

### Como aplicar

1. **Selecionar frame representativo**: escolher frame do meio da transição mais importante do beat.
2. **Isolar na tela**: abrir still-audit como imagem única, sem contexto de narrativa.
3. **Temporizar**: exibir por exatamente 5 segundos, depois bloquear interação.
4. **Perguntar ao observador**: "Qual é a ideia principal desta cena?" (sem mostrar narração).
5. **Registrar resposta**: comparar com objetivo pedagógico planejado.

### Critério de aprovação

O test passa se **todas** as seguintes condições forem atendidas:

- [x] Observador identifica corretamente a ideia central (≥80% de acerto em teste com n≥5 pessoas)
- [x] Resposta inclui pelo menos um elemento novo presente na cena
- [x] Resposta menciona relação causa-efeito se aplicável
- [x] Não há ambiguidade sobre qual elemento está sendo destacado

### Exemplo de falha comum

**Cena problemática**: quatro elementos aparecem juntos com setas cruzadas, todos se movendo simultaneamente, rótulos longos (6+ palavras).

**Resultado do teste**: 3 de 5 observadores dizem "não sei qual é a ideia", 2 dizem "tem muitas coisas acontecendo".

**Correção**: isolar dois beats separados, um mostra conexão A→B, outro mostra B→C. Aplicar FocusDim nos elementos não relevantes. Reduzir rótulos para 2-3 palavras.

### Checklist pré-teste

Antes de executar teste dos 5 segundos, validar:

- [ ] Elementos ≤4 por beat
- [ ] Rótulos ≤12 palavras, idealmente ≤4
- [ ] Contraste ≥4,5:1 (ideal ≥7:1)
- [ ] Tipografia ≥28px (labels), ≥36px (corpo)
- [ ] Margem segura 96px preservada
- [ ] Apenas um movimento principal (resto estático ou FocusDim)
- [ ] Conexões têm rótulos (setas indicam direção e conteúdo)

Se qualquer item estiver negativamente, revisar antes de testar.

## Teste Mudo

### Objetivo
Validar que sequência de estados faz sentido visualmente sem narração.

### Como aplicar

1. **Reproduzir vídeo completo** no Studio ou still sequence renderizada.
2. **Desligar som** completamente (muta áudio da composição no browser ou desliga speakers).
3. **Assistir sem pausas** tentando seguir lógica da animação.
4. **Registrar confusões**: onde parou, onde ficou perdido, onde precisou rewinds.

### Critério de aprovação

Teste passa se **todas** as seguintes condições forem atendidas:

- [x] Sequência de estados segue ordem lógica (estado inicial → evento → estado final)
- [x ] Rótulos explicam o que cada elemento representa
- [x ] Setas/setas indicam direção e tipo de relação (transformação, envio, chamada)
- [x ] Transformações de estado são visíveis (mudança de cor, forma, posição)
- [x ] Não há salto lógico não explicado visualmente

### Padrões que falham no teste mudo

| Problema | Como identificar | Correção |
|----------|------------------|----------|
| Setas sem rótulo | "Para onde isso vai?" | Adicionar label "API call" ou "data sent" |
| Cores sem significado | "Por que azul agora?" | Documentar significado fixo (azul = novo) |
| Movimento competindo | "Não sei onde olhar" | Isolar movimento único, FocusDim resto |
| Salto temporal | "Onde ficou X?" | Inserir beat intermediário mostrando transição |
| Texto excessivo | "Demora muito pra ler" | Dividir em mais beats, reduzir palavras |

## Teste Espectador Distraído

### Objetivo
Validar legibilidade em condições subótimas (tela pequena, visão periférica).

### Como aplicar

1. **Reduzir viewport**: simular mobile (≤360px width) ou tablet (≤768px width).
2. **Escalar canvas**: usar CSS transform scale() para aproximar/distantar elemento.
3. **Testar zoom**: visualizar a 75%, 50%, 25% de escala mantendo proporção.
4. **Registrar legibilidade**: pode ler rótulos? Identifica foco? Percebe movimento?

### Critério de aprovação

Teste passa se em 50% de escala (metade do tamanho original):

- [ ] Rótulos continuam distinguíveis (não vira borrão)
- [ ] Foco permanece óbvio (elemento maior/mais brilhante/separado)
- [ ] Movimento principal visível (mesmo se detalhes pequenos perderem)
- [ ] Margem segura não é violada (nada cruza borda inferior/superior)

### Ajustes recomendados

Se falhar em 50% de escala:

1. **Aumentar fontes**: labels de 28px → 32px, corpo de 36px → 40px
2. **Simplificar conexões**: reduzir número de linhas cruzadas usando agrupamento
3. **Aumentar contrastes**: mudar background escuro (#1a1a2e) para mais escuro (#0d0d1a)
4. **Eliminar detalhes secundários**: remover decorative elements que não comunicam informação
5. **Reduzir densidade**: aumentar spacing vertical entre rows, horizontal entre cols

## Anti-padrões pedagógicos (evitar absolutamente)

| Anti-padrão | Impacto cognitivo | Correção imediata |
|-------------|-------------------|-------------------|
| Tela cheia de texto sobrecarrega memória de trabalho (palavras > 12 por linha) | Dividir em múltiplos beats com texto progressivo |
| Tudo aparece junto sobrecarga instantânea (todos elementos + 4 novos simultaneamente) | Progressive disclosure com stagger 0,2s entre groups |
| Setas sem rótulo ambiguidade relacional (para onde vai o dado?) | Sempre adicionar label curto indicando tipo de relação |
| Duas animações competindo conflito atencional (dois elementos em movimento principal) | Foco único, FocusDim no secundário |
| Cores sem significado padrão inconsistente (azul usado para três conceitos diferentes) | Estabelecer glosário fixo (azul=novo, laranja=muda, verde=ok) |
| Easing linear artificialidade (move igual em todo frame) | Usar springs (SNAPPY para interface, SMOOTH para transições) |
| Acelerar animação para caber na fala compressão artificial | Dividir beat, não apressar movimento natural |
| Codificar vídeo inteiro antes do CP1 falta de iteração pedagógica | Criar piloto 5-10s primeiro, só então expandir |
| Valores mágicos nas cenas inconsistência (18px aqui, 20px ali) | Extrair tudo para tokens.ts, nunca literais |

## Validação iterativa obrigatória

**Nunca pedir aprovação sem evidência**. Antes de cada checkpoint:

1. **Rodar tsc --noEmit**: confirmar TypeScript clean
2. **Rudar audit por stills**: gerar imagens nos frames chave (início/fim/transição/cue)
3. **Aplicar teste dos 5 segundos**: pelo menos uma pessoa externa confirma identificação
4. **Aplicar teste mudo**: observar se sequência faz sentido sem áudio
5. **Contar elementos novos por beat**: verificar ≤4 e um movimento principal

Só então enviar mensagem de checkpoint com:

```markdown
## Evidências
- tsc/lint: SUCESSO (0 erros/warnings)
- Still audit: out/audit/frame-{0,mid,end}.png (anexar 3 imagens)
- Teste 5 segundos: [X] de [Y] acertaram ideia central
- Teste mudo: [APROVADO/REPROVADO] - [comentário]
- Elementos por beat: médio 2,8 (limite 4 atingido apenas em beat 7)
```

Se qualquer evidência falhar, corrigir antes de pedir aprovação. Nunca dizer que olhou imagem que não viu.

## Resumo checklist pedagógico

Antes de considerar beat aprovado:

- [ ] Uma ideia por beat (pergunta única respondida)
- [ ] Elementos novos ≤4, um movimento principal
- [ ] Rótulos ≤4 palavras, frases ≤12 palavras
- [ ] Duração ≥max(1,2s, palavras÷3,5)
- [ ] Conexões têm rótulos (setas indicam direção e conteúdo)
- [ ] Cores ≤3, significado fixo documentado
- [ ] Teste 5s: ideia identificável isoladamente
- [ ] Teste mudo: sequência lógica compreensível
- [ ] Teste distraído: legível em 50% escala
- [ ] Tamanhos mínimos: labels 28px+, corpo 36px+, código 30px+
- [ ] Contraste ≥4,5:1 (≥7:1 para fino)
- [ ] Margem segura 96px preservada
- [ ] Tokens aplicados: nenhuma cor/espessura/frameduration literal

Se todas checked ✅, progresso para próxima etapa. Se alguma ❌, revisar pedagogicamente antes de codificar mais.

