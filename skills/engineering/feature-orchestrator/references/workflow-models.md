# Modelos de fluxo de trabalho

Cinco modelos disponíveis. Escolha pelo risco e incerteza da feature.

| Modelo | Quando usar | Características |
|--------|-------------|-----------------|
| **Cascata** | Requisitos estáveis, baixa incerteza | Etapas sequenciais, aprovação por etapa, mudança material reabre planejamento |
| **Incremental** | Escopo pode mudar, entrega por fatias | Cada fatia é entregável; incorpora mudanças na próxima fatia |
| **Prototipação** | Solução incerta, explorar viabilidade | Protótipos descartáveis; deixar claro o que é descartável |
| **Espiral (risk-driven)** | Alto risco, múltiplas incógnitas | Ciclos com análise de risco; incorpora mudanças no próximo ciclo |
| **Método formal** | Domínio regulado, certificação | Especificações + obrigações de prova; atualizar specs antes de tratar implementação como verificada |

## Seleção rápida

- Requisitos claros e estáveis → Cascata
- Escopo evolutivo, entrega contínua → Incremental
- Viabilidade desconhecida → Prototipação
- Alto risco técnico → Espiral
- Regulação/certificação → Método formal

## Execução

Siga as etapas da skill conforme o modelo escolhido. Cada etapa que se aplica tem subagente responsável, com entrada e saída delimitadas. Só inicie a etapa seguinte após conferir e aceitar o artefato anterior.