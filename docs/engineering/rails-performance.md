## What it does

`rails-performance` guides investigation of slow Rails pages and endpoints, especially database work, pagination, caching, and background processing. It starts from a representative measurement and changes one source of cost at a time.

The defining constraint is evidence: a common performance pattern is a hypothesis to measure, not an automatic defect to fix.

## When to reach for it

Type `/rails-performance`, or the agent reaches for it when a Rails page or endpoint is slow, a query is being written, or a change touches database work in a loop. For where behavior should live, use [rails-architecture](https://aihero.dev/skills-rails-architecture).

## Follow the measured cost

A request can be slow because it loads too many records, repeats a query, performs expensive rendering, or waits on external work. The useful fix depends on the measured path. Eager loading, batching, pagination, cache layers, and jobs each solve different shapes of work.

## Common questions

**Should I add `includes` whenever a page has an N+1?**

Choose among `includes`, `preload`, and `eager_load` based on the query and filtering behavior. Confirm the generated SQL and measured result.

**Should I cache a slow result?**

First locate the repeated cost and decide whether caching has a clear invalidation boundary. A cache can hide unnecessary work while adding stale-data behavior.

## It's working if

- The slow path and its cost are measured before a change.
- The chosen fix targets that measured cost and preserves correctness.
- Before and after results use the same representative workload.

## Where it fits

This is a diagnosis and optimization reference for Rails. [rails-architecture](https://aihero.dev/skills-rails-architecture) helps place the behavior; [code-review](https://aihero.dev/skills-code-review) reviews the resulting committed diff. [ask-matt](https://aihero.dev/skills-ask-matt) routes across the full skill set.
