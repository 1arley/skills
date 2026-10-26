---
name: feature-orchestrator
description: "Coordinate nontrivial software feature delivery through scoped agent stages, choosing cascade, incremental, prototype, risk-driven spiral, or formal-methods workflows. Use when implementation needs staged planning and delegation."
---

# Orquestrar entrega de features

Use esta skill para levar uma feature de descoberta a entrega com etapas delegadas a subagentes. O agente principal é o orquestrador: mantém o estado aceito, escolhe a próxima tarefa, prepara o contexto de entrada, confere o resultado e conversa com o usuário nos pontos previstos pelo modelo.

Para uma alteração trivial e autocontida, trabalhe diretamente sem impor este processo. Preserve instruções do repositório, escopo, permissões e convenções já existentes.

## Escolha do fluxo e de quem decide

1. Entenda o resultado desejado, critérios de aceite, restrições, prazo, riscos e quanto o escopo pode mudar. Consulte as instruções e o estado atual do repositório antes de planejar.
2. Use o modelo escolhido pelo usuário. Se não houver escolha, recomende um dos cinco modelos em [workflow-models.md](references/workflow-models.md) e informe brevemente por quê. Separe a escolha do modelo de processo de quem decide questões em aberto.
3. Registre quem decide: **usuário**, **Jev** ou **orquestrador**. No modo usuário, faça uma conversa curta para resolver decisões materiais. No modo orquestrador, decida questões reversíveis usando o repositório, os requisitos e o julgamento recomendado, expondo as decisões relevantes. No modo Jev, consulte uma interface Jev realmente disponível; use a skill `typesafe-ai` como orientação quando ela estiver instalada.
4. A skill `typesafe-ai` descreve como construir software com TypeSafe e Jev; ela não garante que exista uma chamada interativa de Jev neste ambiente. Se não houver uma interface Jev acessível, não diga que consultou Jev. Para decisão material, informe a limitação e peça autorização para o orquestrador decidir ou para o usuário decidir. Para uma preferência reversível e de baixo impacto, aplique o fallback que o usuário autorizou e registre-o.

## Ciclo de trabalho

Siga as etapas apropriadas ao modelo:

1. **Pesquisa e grilling:** delegue a descoberta de contexto, requisitos, incógnitas e perguntas que mudariam a solução. O orquestrador conduz a conversa com o usuário quando a política de decisão pedir.
2. **Planejamento:** delegue escopo, critérios de aceite, fatias de entrega, dependências, riscos e plano de verificação.
3. **Arquitetura e modelagem:** delegue a solução técnica e seus contratos, dados, interfaces e impactos no sistema existente.
4. **Construção:** delegue uma implementação delimitada ao plano aceito.
5. **Verificação:** delegue testes e revisão independente conforme o modelo; compare evidências com os critérios de aceite.
6. **Entrega:** delegue a preparação do resumo de entrega e itens pendentes; o orquestrador confere e apresenta o resultado ao usuário.

Cada etapa que se aplica deve ter um subagente responsável, com entrada e saída delimitadas. Só inicie a etapa seguinte depois de conferir e aceitar o artefato anterior. Paralelize apenas trabalho independente e sem conflito de escrita. Se o ambiente não oferecer subagentes, informe isso e execute os mesmos papéis sequencialmente, mantendo os handoffs explícitos; não invente delegações.

Use um pacote curto por tarefa, conforme [delegation-protocol.md](references/delegation-protocol.md). Passe os artefatos relevantes e um resumo das decisões aceitas; não despeje a conversa inteira nem peça ao subagente que reconstrua decisões anteriores. O orquestrador mantém uma fonte de verdade para modelo, escopo, decisões, riscos, estado da etapa, evidências e próxima tarefa.

Após cada retorno, confira o trabalho no repositório ou contra os artefatos de entrada, registre o que foi aceito e o que continua aberto e só então prepare o próximo pacote. Um subagente pode recomendar mudanças, mas não pode ampliar sozinho o escopo, ignorar uma aprovação requerida ou declarar conformidade regulatória.

## Mudanças e encerramento

Aceite mudanças de direção durante o processo. Registre a decisão, avalie quais requisitos e artefatos ela afeta e reabra somente as etapas impactadas. No cascata, uma mudança material reabre planejamento e pede nova aprovação segundo a política escolhida. Nos modelos incremental e espiral, incorpore-a na próxima fatia ou ciclo. Na prototipação, mantenha claro o que é descartável. No método formal, atualize especificações e obrigações de prova afetadas antes de tratar a implementação como verificada.

Ao concluir, apresente o que foi entregue, arquivos ou artefatos relevantes, verificações realizadas e seus resultados, decisões importantes e riscos ou pendências. Diferencie uma prova de conceito de software pronto para produção e evidência formal de uma alegação de certificação. Não declare teste, prova, revisão, aprovação ou consulta a Jev que não tenha ocorrido.

Leia [workflow-models.md](references/workflow-models.md) para selecionar e executar o modelo. Leia [delegation-protocol.md](references/delegation-protocol.md) ao criar handoffs ou coordenar subagentes.
