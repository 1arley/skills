## What it does

`feature-orchestrator` coordinates nontrivial feature delivery through scoped stages, from discovery and planning to implementation and verification. It chooses among cascade, incremental, prototype, risk-driven spiral, and formal-methods workflows by explicit priority, then follows the selected model's stage rhythm.

The orchestrator keeps a compact accepted-state summary in the conversation and updates it after each accepted handoff. It persists that summary only when asked or when an existing project convention gives it a home. For a small, self-contained change, it says to work directly instead of imposing a process.

## When to reach for it

Type `/feature-orchestrator`, or the agent reaches for it when a feature needs staged planning and coordination. Use it when multiple unknowns or dependent workstreams make a direct implementation hard to control. For one focused implementation task, use the project's normal coding flow.

## Scoped stages

Each stage has a defined input, artifact, and acceptance check. The workflow choice follows a priority: formal obligations, high technical risk, unknown feasibility, likely scope changes, then stable requirements. Each model sets its stage rhythm, from gated sequential work to repeated cycles or slices. When subagents are available, their work returns to the orchestrator for inspection before the next stage begins. Without subagents, the stages run sequentially. This keeps one accepted plan in view as the feature changes shape.

## Common questions

**Which workflow should a feature use?**

The skill chooses by priority: formal obligations first, then high risk, unknown feasibility, likely scope changes, and stable requirements. It records the chosen workflow and tailors its stage rhythm when the context justifies it.

**Does it delegate every step?**

It delegates each applicable stage when subagents are available; without them, it runs the stages sequentially. Trivial, contained changes are done directly.

## It's working if

- Each active stage has a clear artifact and a check before work advances.
- The chosen workflow follows the priority of formal obligations, technical risk, feasibility uncertainty, scope change, then requirement stability.
- Small changes do not acquire unnecessary planning stages.

## Where it fits

This is a coordination skill for a feature that spans multiple steps. [code-review](https://aihero.dev/skills-code-review) checks the delivered diff; [scoped-git-workflow](https://aihero.dev/skills-scoped-git-workflow) prepares requested commits and pushes. For broader routing, see the [ask-matt page on aihero.dev](https://aihero.dev/skills-ask-matt).
