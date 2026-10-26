## What it does

`rust-testing` helps design, add, and diagnose Rust tests using the project's existing test structure and tools. It covers unit, integration, documentation, async, and property-oriented tests without assuming a particular framework.

The defining constraint is to protect observable behavior and boundaries, not incidental implementation details. Test setup should follow the crate's features, helpers, and CI commands.

## When to reach for it

Type `/rust-testing`, or the agent reaches for it when designing tests, changing test code, or diagnosing a Rust test failure. For code organization and API boundaries, use [rust-architecture](https://aihero.dev/skills-rust-architecture).

## Choose the boundary

Unit tests fit private details that need direct coverage. Integration tests exercise public behavior as a caller sees it, while doctests capture public examples and contracts. Async tests should control ordering and cancellation with synchronization, not arbitrary sleeps.

## Common questions

**Should every function have a unit test?**

No. Test behavior and boundaries that matter, including error cases and limits. Avoid assertions tied to private structure unless that structure is the contract.

**Why does a Rust test fail only in CI?**

Check feature selection, parallel execution, target configuration, fixtures, and environmental dependencies before assuming the code behaves differently.

## It's working if

- Tests use existing project helpers and dependencies.
- Assertions cover relevant behavior without coupling to internal details.
- Async and parallel tests remain deterministic under the project's normal runner.

## Where it fits

This is an anytime test design and diagnosis reference for Rust. [rust-style](https://aihero.dev/skills-rust-style) covers production conventions; [rust-performance](https://aihero.dev/skills-rust-performance) covers representative benchmarks. [ask-matt](https://aihero.dev/skills-ask-matt) routes across the full skill set.
