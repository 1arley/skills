## What it does

`feature-orchestrator` coordinates nontrivial feature delivery through scoped stages, from discovery and planning to implementation and verification. It chooses among cascade, incremental, prototype, risk-driven spiral, and formal-methods workflows according to the feature's uncertainty and risk.

The orchestrator owns the accepted state and checks each handoff. For a small, self-contained change, it says to work directly instead of imposing a process.

## When to reach for it

Type `/feature-orchestrator`, or the agent reaches for it when a feature needs staged planning and coordination. Use it when multiple unknowns or dependent workstreams make a direct implementation hard to control. For one focused implementation task, use the project's normal coding flow.

## Scoped stages

Each stage has a defined input, artifact, and acceptance check. When subagents are available, their work returns to the orchestrator for inspection before the next stage begins. Without subagents, the stages run sequentially. This keeps one accepted plan in view as the feature changes shape.

## Common questions

**Which workflow should a feature use?**

The choice depends on uncertainty, risk, and how much the requirements may change. The skill compares the five workflows and records the chosen decision model.

**Does it delegate every step?**

No. It uses staged coordination for nontrivial work and directs trivial, contained changes to be done directly.

## It's working if

- Each active stage has a clear artifact and a check before work advances.
- The chosen workflow matches the feature's uncertainty and risk.
- Small changes do not acquire unnecessary planning stages.

## Where it fits

This is a coordination skill for a feature that spans multiple steps. [code-review](https://aihero.dev/skills-code-review) checks the delivered diff; [scoped-git-workflow](https://aihero.dev/skills-scoped-git-workflow) prepares requested commits and pushes. For broader routing, see the [ask-matt page on aihero.dev](https://aihero.dev/skills-ask-matt).
