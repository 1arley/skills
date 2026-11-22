## What it does

`ask-matt` is a user-invoked router for the promoted skills in this repository. It maps your situation to a skill or short sequence, then stops. Before describing a skill's behavior or recommending that you skip one, it reads that skill's `SKILL.md`.

The map is maintained by hand. It does not scan personal or third-party skills installed elsewhere.

## When to reach for it

You invoke it by typing `/ask-matt`; the agent will not reach for it on its own. Use it when you know the outcome you want but are unsure which skill or sequence fits. If you already know which skill you need, invoke it directly.

## Common routes

| Situation | Route |
| --- | --- |
| A nontrivial feature needs staged planning and delivery | [feature-orchestrator](https://aihero.dev/skills-feature-orchestrator) |
| A branch, diff, or pull request needs review against standards and its originating spec | [code-review](https://aihero.dev/skills-code-review) |
| A settled architecture decision needs a numbered ADR | [decision-to-adr](https://aihero.dev/skills-decision-to-adr) |
| You want JEV to decide among options in rounds | [grill-with-jev](https://aihero.dev/skills-grill-with-jev) |
| You explicitly want to commit and push changes | [scoped-git-workflow](https://aihero.dev/skills-scoped-git-workflow) |
| You want a technical explanation animation made with Remotion | [remotion-explainer](https://aihero.dev/skills-remotion-explainer) |
| You need Rails design or performance guidance | [rails-architecture](https://aihero.dev/skills-rails-architecture) for code placement; [rails-performance](https://aihero.dev/skills-rails-performance) for a speed problem |
| You need Ruby style or test guidance | [ruby-style](https://aihero.dev/skills-ruby-style) for production code; [ruby-testing](https://aihero.dev/skills-ruby-testing) for tests |
| You need Rust module design, performance, style, or test guidance | [rust-architecture](https://aihero.dev/skills-rust-architecture), [rust-performance](https://aihero.dev/skills-rust-performance), [rust-style](https://aihero.dev/skills-rust-style), or [rust-testing](https://aihero.dev/skills-rust-testing), respectively |

User-invoked skills must be typed by the human. `ask-matt` can recommend [decision-to-adr](https://aihero.dev/skills-decision-to-adr) or [grill-with-jev](https://aihero.dev/skills-grill-with-jev), but does not invoke them.

## Common questions

**Does it start the skill it recommends?**

No. It names what to type and stops.

**Can it route to skills outside this repository?**

No. It maps only the promoted skills listed here and does not inspect other installations.

**How does it avoid stale descriptions?**

It reads the selected skill's `SKILL.md` before making claims about its behavior. The source skill is authoritative if its instructions differ from the route summary.

## It's working if

- The recommended skill exists in this repository's promoted set.
- The route gives you a clear next command and a short reason.
- User-invoked skills are presented for you to invoke, not launched by the router.
- It stops after routing instead of doing the requested work itself.

## Where it fits

`ask-matt` is a standalone router, not a step in a build flow. It routes nontrivial staged delivery to [feature-orchestrator](https://aihero.dev/skills-feature-orchestrator), completed changes to [code-review](https://aihero.dev/skills-code-review), and settled architecture decisions to [decision-to-adr](https://aihero.dev/skills-decision-to-adr). It is the map over this repo's promoted skill set.
