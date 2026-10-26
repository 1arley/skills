## What it does

`rust-architecture` helps place Rust code at useful crate and module boundaries, design public APIs, and choose how errors, state, and concurrency should work. It considers runtime and `unsafe` choices in the context of the crate's constraints.

The defining constraint is to follow the existing design unless a concrete change pressure justifies a new boundary. Public API and supported targets are compatibility constraints, not cleanup details.

## When to reach for it

Type `/rust-architecture`, or the agent reaches for it when a change crosses modules or crates, adds a public API, or chooses an execution model. For routine edits inside an established boundary, use [rust-style](https://aihero.dev/skills-rust-style).

## Boundaries and invariants

Crates and modules should hide implementation behind small, useful interfaces. Keep errors inspectable at the right boundary. Use `unsafe` only when safe Rust cannot meet the requirement or a measured constraint justifies it, and identify the invariant each unsafe block relies on.

## Common questions

**When does code deserve its own crate?**

When it creates a meaningful boundary for ownership, compilation, reuse, or compatibility. A new crate that only moves files adds maintenance without an interface benefit.

**When is `unsafe` justified?**

When the requirement cannot be expressed safely or measurement supports the tradeoff. The exact preconditions and the code that upholds them must be clear.

## It's working if

- The module structure makes ownership and public contracts apparent.
- Errors and concurrency choices match the callers and runtime.
- Any `unsafe` block is narrow and names the invariant it depends on.

## Where it fits

This is a design reference for Rust changes that affect boundaries or long-lived interfaces. [rust-style](https://aihero.dev/skills-rust-style) covers local idioms; [rust-performance](https://aihero.dev/skills-rust-performance) guides measured optimization. [ask-matt](https://aihero.dev/skills-ask-matt) routes across the full skill set.
