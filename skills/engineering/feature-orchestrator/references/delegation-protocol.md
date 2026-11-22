# Delegation protocol

Use a short task packet. Include:

- **Stage**: stage name (research, planning, architecture, building, verification, delivery)
- **Objective**: expected result in one sentence
- **Inputs**: relevant artifacts, accepted decisions, and constraints
- **Acceptance criteria**: how to check the result
- **Expected output**: format of the returned artifact
- **Limits**: what not to do, including scope, files, and decisions

## Rules

- Include a summary of accepted decisions. Do not dump the entire conversation.
- Do not ask a subagent to reconstruct prior decisions.
- The orchestrator maintains the source of truth: workflow, scope, decisions, risks, stage status, evidence, and next task.
- A subagent may recommend changes, but cannot expand scope on its own, bypass a required approval, or claim regulatory compliance.
- After each response, check the work in the repository or against the input artifacts. Record what was accepted and what remains open, then prepare the next packet.
- Parallelize only independent work with no write conflicts.
- If subagents are unavailable, perform the same roles sequentially and keep the handoffs explicit.
