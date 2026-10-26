---
name: llm-cost-guard
description: Estimate cost LLM call, set spending cap, budget API calls, how much will cost, track token usage, stop if costs more than. Use before any paid LLM call when user asks to estimate or cap spending.
---
# llm-cost-guard

Antes de qualquer chamada paga, use CLI local `scripts/llm-cost-guard.mjs`. Não chame provedor diretamente antes da reserva. CLI não invoca provedores nem intercepta chamadas fora deste protocolo.

## Protocolo obrigatório

1. Identifique provider, model, sessão explícita, teto, limite de saída e tokens de entrada estimados. Se taxa faltar ou estiver inválida, pare; nunca assuma custo zero.
2. Execute `estimate` com taxas locais. Compare custo máximo com orçamento restante.
3. Se limiar de aprovação configurado for ultrapassado ou CLI responder `needsApproval`, pergunte ao usuário. Não prossiga sem aprovação explícita.
4. Execute `reserve` antes de chamar provedor. Se recusar, pare e mostre saldo/teto.
5. Faça uma chamada usando ferramenta/cliente autorizados, sem passar segredos à CLI.
6. Em sucesso, normalize usage com adapter suportado e execute `settle`. Em falha anterior a qualquer consumo, execute `release`. Se request consumiu tokens apesar de erro, liquide usage; retry exige reserva nova.
7. Mostre `status` e custo ao usuário.

Reserva contabiliza custo máximo enquanto chamada ocorre. Evita que retries ou chamadas paralelas ultrapassem teto. Sessão deve permanecer igual em todas operações; sessões isoladas por cwd.

## CLI

Use JSON e argumentos separados:

```sh
node scripts/llm-cost-guard.mjs estimate --session sessao-1 --provider openai --model modelo-configurado --input-tokens 1200 --max-output-tokens 800 --rates ./rates.json
node scripts/llm-cost-guard.mjs reserve --session sessao-1 --provider openai --model modelo-configurado --input-tokens 1200 --max-output-tokens 800 --id tentativa-1
node scripts/llm-cost-guard.mjs settle --session sessao-1 --id tentativa-1 --provider openai --model modelo-configurado --usage '{"usage":{"input_tokens":1200,"output_tokens":300}}'
node scripts/llm-cost-guard.mjs status --session sessao-1
```

Configure `.llm-cost-guard/config.json`; importe somente taxas próprias via `rates import`. Leia [rates.md](references/rates.md), [usage-formats.md](references/usage-formats.md), [exit-codes.md](references/exit-codes.md) e [security.md](references/security.md). Nunca cole prompt, resposta, credencial ou headers em argumentos/logs.

## Exemplo: sessão com três chamadas

1. Chamada A estimada 40 micro-USD; reserva `call-a`, chamada consome 25; `settle` registra 25.
2. Chamada B estimada 70; teto restante comporta. Reserva `call-b`; provedor falha antes do envio; `release` devolve 70. Retry é nova tentativa e reserva nova.
3. Chamada C estimada 90, teto restante 60; `reserve` recusa com código 10. Não chame provedor; mostre recusa ao usuário.

Valores ilustrativos, não preços recomendados. Se chamada falha após consumo, contabilize usage, não libere custo já incorrido.
