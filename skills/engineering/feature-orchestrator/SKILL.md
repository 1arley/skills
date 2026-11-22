---
name: feature-orchestrator
description: "Coordinate nontrivial software feature delivery through scoped agent stages, choosing cascade, incremental, prototype, risk-driven spiral, or formal-methods workflows. Use when implementation needs staged planning and delegation."
---

# Feature Orchestration

Use this skill to take a feature from discovery through delivery with delegated stages. The orchestrator owns the accepted state, chooses the next task, prepares its input context, checks the result, and talks with the user at the points required by the selected workflow.

For a trivial, self-contained change, work directly without imposing this process. Preserve the repository's instructions, scope, permissions, and conventions.

## Choosing the workflow and decision owner

1. Understand the desired outcome, acceptance criteria, constraints, deadline, risks, and how much the scope may change. Check the repository instructions and current state before planning.
2. Use the workflow chosen by the user. If they have not chosen one, recommend one of the five models in [workflow-models.md](references/workflow-models.md) and briefly explain why. Keep the workflow choice separate from who decides open questions.
3. Record who decides: **the user**, **Jev**, or **the orchestrator**. In user mode, have a short conversation to resolve material decisions. In orchestrator mode, decide reversible questions using the repository, requirements, and recommended judgment, and expose the relevant decisions. In Jev mode, use a Jev interface that is actually available; use the `typesafe-ai` skill as guidance when installed.
4. The `typesafe-ai` skill describes how to build software with TypeSafe and Jev; it does not guarantee that an interactive Jev call is available in this environment. If no Jev interface is accessible, do not claim to have consulted Jev. For a material decision, explain the limitation and ask whether the orchestrator or the user should decide. For a reversible, low-impact preference, use the fallback the user authorized and record it.

## Work cycle

Follow the stages that apply to the selected model:

1. **Research and grilling:** delegate discovery of context, requirements, unknowns, and questions that could change the solution. The orchestrator leads the user conversation when the decision policy calls for it.
2. **Planning:** delegate scope, acceptance criteria, delivery slices, dependencies, risks, and verification planning.
3. **Architecture and modeling:** delegate the technical approach, contracts, data, interfaces, and system impacts.
4. **Building:** delegate implementation bounded by the accepted plan.
5. **Verification:** delegate testing and independent review as appropriate to the model; compare evidence with the acceptance criteria.
6. **Delivery:** delegate preparation of the delivery summary and open items; the orchestrator checks and presents the result to the user.

Each applicable stage must have a responsible subagent, with bounded inputs and outputs. Start the next stage only after checking and accepting the previous artifact. Parallelize only independent work that has no write conflicts. If subagents are unavailable, explain that and perform the same roles sequentially with explicit handoffs; do not invent delegations.

Use a short task packet based on [delegation-protocol.md](references/delegation-protocol.md). Include relevant artifacts and a summary of accepted decisions; do not dump the whole conversation or ask a subagent to reconstruct prior decisions. Keep a concise accepted-state summary in the conversation: workflow, scope, decisions, risks, current stage, evidence, and next task.

After each response, check the work in the repository or against its input artifacts, update the summary with what was accepted and what remains open, and only then prepare the next packet. Send each subagent only the relevant part of the summary. Persist the summary in a repository artifact only when the user asks or an existing convention defines where it belongs. A subagent may recommend changes, but cannot expand scope on its own, bypass a required approval, or claim regulatory compliance.

## Changes and closeout

Accept changes in direction during the process. Record the decision, assess which requirements and artifacts it affects, and reopen only the affected stages. In cascade, a material change reopens planning and requires approval again according to the chosen decision policy. In incremental and spiral workflows, incorporate the change in the next slice or cycle. In prototyping, keep clear which work is disposable. In the formal method, update affected specifications and proof obligations before treating the implementation as verified.

At completion, report what was delivered, relevant files or artifacts, checks performed and their results, important decisions, and risks or open items. Distinguish a proof of concept from production-ready software, and formal evidence from a claim of certification. Do not claim a test, proof, review, approval, or Jev consultation that did not happen.

Read [workflow-models.md](references/workflow-models.md) to select and run a model. Read [delegation-protocol.md](references/delegation-protocol.md) when creating handoffs or coordinating subagents.
