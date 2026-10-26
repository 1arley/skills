## What it does

`rails-architecture` helps decide where behavior belongs in a Rails application: a model, service object, PORO, policy, or background job. Thin controllers remain the rule, while model boundaries follow responsibility rather than a size limit.

The defining constraint is to prefer Rails conventions only when they reduce real duplication. A service wrapper or registry adds indirection when it does not address a concrete responsibility.

## When to reach for it

Type `/rails-architecture`, or the agent reaches for it when deciding where Rails behavior belongs, adding service or model behavior, or untangling a growing controller. For a measured latency or query problem, use [rails-performance](https://aihero.dev/skills-rails-performance).

## Responsibilities over class size

A behavior that spans models may belong in a service, pure computation may fit a PORO, and authorization may fit a policy. Jobs need idempotent effects because they can retry. These are starting points; the actual responsibility boundary decides.

## Common questions

**When should I extract a service object?**

When behavior spans multiple models, has more than one entry point, or is complex enough to test independently. A wrapper around one `save` call usually adds no value.

**Should every large model be split?**

No. Split by responsibility and change pressure, not line count alone.

## It's working if

- Controllers authorize, load, delegate, and respond without owning business rules.
- New classes represent a responsibility that callers can name.
- Jobs tolerate retries and do not rely on request-only state.

## Where it fits

This is an anytime design reference for Rails code. [rails-performance](https://aihero.dev/skills-rails-performance) addresses measured speed issues; [code-review](https://aihero.dev/skills-code-review) checks a completed diff against repository rules. [ask-matt](https://aihero.dev/skills-ask-matt) routes across the full skill set.
