---
name: ask-matt
description: Ask which skill or workflow fits your situation. A hand-maintained router for the promoted skills in this repository.
disable-model-invocation: true
---

# Ask Matt

Describe what you are trying to do and where you are in the work. I recommend the skill or short sequence that fits, then stop. I do not start the recommended skill for you.

This is a hand-maintained map of this repository's promoted skills. It does not scan your other installed skills. If you have already chosen a skill, invoke it directly.

Before describing a skill's behavior or recommending that you skip one, read its `SKILL.md`. The routes below help choose where to look; the skill itself is authoritative.

## Routes

| Situation | Start with |
| --- | --- |
| A nontrivial software feature needs staged planning and delivery | `feature-orchestrator` coordinates scoped stages and chooses a workflow for the feature's risk, uncertainty, and scope. |
| You want a branch, diff, or pull request checked against repository standards and its originating spec | `code-review`. It reviews completed or in-progress changes; it does not plan the feature. |
| You have settled an architectural decision and want to publish it as a numbered ADR | `decision-to-adr`. This is user-invoked, so type `/decision-to-adr` yourself. |
| You want Jev to choose among options in schema-validated rounds | `grill-with-jev`. This is user-invoked, so type `/grill-with-jev` yourself. |
| You explicitly want to commit and push the current changes | `scoped-git-workflow`. It handles the requested git closeout. |
| You want an explanation animation made with Remotion | `remotion-explainer`. |
| You need to place behavior in a Rails application | `rails-architecture`; for a measured or suspected Rails performance problem, use `rails-performance`. |
| You are writing or reviewing Ruby and need style guidance | `ruby-style`; for Ruby test design or debugging, use `ruby-testing`. |
| You are writing or reviewing Rust and need module or crate design | `rust-architecture`; for performance, style, or tests, use `rust-performance`, `rust-style`, or `rust-testing`, respectively. |
| You are between work phases and deciding what to do with the current context | Read [PHASE-BOUNDARIES.md](PHASE-BOUNDARIES.md), then choose between continuing, clearing, handing off, delegating, or compacting. |

When a task needs more than one skill, give the shortest useful sequence and say why each step follows. Do not route to a user-invoked skill as if you could invoke it; tell the user to type its command.

If none of these routes fits, say so. Do not invent a repository skill or imply this map includes skills installed elsewhere.

When changing routes, keep [evals/evals.json](evals/evals.json) in sync and review its scenarios against this map. The repository has no automatic runner for these routing evaluations.
