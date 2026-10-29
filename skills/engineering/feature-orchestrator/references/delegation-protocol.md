# Protocolo de delegação

Pacote curto por tarefa. Inclua:

- **Etapa**: nome da etapa (pesquisa, planejamento, arquitetura, construção, verificação, entrega)
- **Objetivo**: resultado esperado em uma frase
- **Entradas**: artefatos relevantes (arquivos, decisões aceitas, restrições)
- **Critérios de aceite**: como conferir o resultado
- **Saída esperada**: formato do artefato de retorno
- **Limites**: o que não fazer (escopo, arquivos, decisões)

## Regras

- Passe resumo das decisões aceitas; não despeje a conversa inteira.
- Não peça ao subagente que reconstrua decisões anteriores.
- Orquestrador mantém fonte de verdade: modelo, escopo, decisões, riscos, estado da etapa, evidências, próxima tarefa.
- Subagente pode recomendar mudanças, mas não amplia sozinho o escopo, não ignora aprovação requerida, não declara conformidade regulatória.
- Após retorno, confira no repositório ou contra artefatos de entrada; registre aceito e aberto; só então prepare próximo pacote.
- Paralelize apenas trabalho independente e sem conflito de escrita.
- Sem subagentes: execute os mesmos papéis sequencialmente, handoffs explícitos.