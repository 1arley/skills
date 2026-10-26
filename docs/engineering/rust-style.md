## What it does

`rust-style` helps write and review idiomatic Rust that fits a crate's ownership, error, naming, documentation, formatting, lint, and compatibility conventions. It treats the local toolchain and MSRV policy as part of the code's contract.

The defining constraint is to avoid style-only churn. An idiom is useful when it improves correctness, clarity, API quality, or a measured concern.

## When to reach for it

Type `/rust-style`, or the agent reaches for it when writing or reviewing general Rust code. For a measured performance issue, use [rust-performance](https://aihero.dev/skills-rust-performance); for test design, use [rust-testing](https://aihero.dev/skills-rust-testing).

## Fit the crate

Check the project's edition, MSRV, formatter, lints, features, and nearby code before proposing a style change. Keep fallible operations as `Result`, use `Option` for expected absence, and preserve useful error sources.

## Common questions

**Should every `unwrap()` be removed?**

No. First check whether the value is trusted and whether a local invariant makes failure impossible. Do not use `unwrap()` to silence a production error path.

**Should I prefer iterators over loops?**

Choose the form that makes the transformation easiest to understand. The skill does not prescribe iterator syntax for its own sake.

## It's working if

- The code follows the crate's toolchain, MSRV, and local patterns.
- Errors remain inspectable and panics are reserved for justified invariants.
- The diff changes style where it improves the code, not merely to express personal preference.

## Where it fits

This is an anytime reference for Rust code. [rust-architecture](https://aihero.dev/skills-rust-architecture) handles module and API boundaries; [rust-testing](https://aihero.dev/skills-rust-testing) handles test behavior and reliability. [ask-matt](https://aihero.dev/skills-ask-matt) routes across the full skill set.
