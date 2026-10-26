---
name: rust-testing
description: >
  Design, add, or diagnose Rust tests using the repository's existing test
  structure and tools. Covers unit, integration, documentation, async, and
  property-oriented tests without assuming a particular test framework.
---

# Rust testing

Use this skill when designing tests, changing test code, or diagnosing a failing Rust test suite.

## Inspect the test setup first

Check workspace and package manifests, test modules, integration tests under `tests/`, doctests, feature flags, `cfg` attributes, CI commands, and existing helpers. Follow the project's test dependencies and naming style. Don't add a testing crate just to use a familiar pattern.

## Choose the right test boundary

- Put small unit tests beside private implementation details when they need access to those details.
- Use integration tests for observable public behavior, binary behavior, and interactions across crate boundaries. They compile as external users would and help protect API usability.
- Use doctests for public examples and contracts callers need to understand. Keep examples deterministic and self-contained.
- Test the behavior and boundary conditions that matter: empty and malformed input, error variants/context, state transitions, limits, and regressions. Avoid assertions about private implementation details unless those details are the behavior under test.
- Prefer a few precise assertions about one behavior over tests coupled to incidental output or setup order. A test may assert several related properties when they jointly define the same contract.

## Keep tests reliable

- Avoid dependence on wall-clock timing, external services, global environment, current working directory, or shared mutable state unless the test is specifically about that integration.
- Use temporary directories and unique resources with cleanup helpers already used by the project. Don't assume tests execute serially; Cargo may run them concurrently.
- Prefer explicit inputs and small fixtures. Use builders or fixture files when they make intent easier to see; avoid elaborate fixture frameworks for simple setup.
- For snapshots, pin down normalization and update procedure. A snapshot is useful for complex output, but can obscure the intended contract if used for every assertion.
- Seed random or property tests for reproducibility where supported; retain failing cases as regression tests.

## Async and concurrent tests

Use the runtime and test macros already adopted by the project. Test cancellation, timeouts, ordering, backpressure, and shutdown where they are part of the contract. Avoid tests that pass only because tasks happen to be scheduled in one order. Use synchronization primitives or controlled test doubles instead of arbitrary sleeps. Keep runtime-specific concerns out of synchronous code tests.

## Diagnose failures in order

Reproduce the narrow failing test first, then the package or workspace command used by CI. Read the full failure and identify whether it is an assertion, panic, compile error, timeout, or environmental dependency. Check feature selection, parallel execution, and fixture state before changing production code. Fix the smallest underlying cause and retain a regression test when the bug is user-visible.

Common commands, adjusted to repository scripts and features:

```bash
cargo test -p crate_name test_name
cargo test -p crate_name
cargo test --workspace
cargo test --doc
```

Do not run every command blindly if it is expensive or the project documents a different workflow.

## References

- [Cargo: tests](https://doc.rust-lang.org/cargo/guide/tests.html)
- [Rust Book: writing automated tests](https://doc.rust-lang.org/book/ch11-00-testing.html)
- [Rust test attributes](https://doc.rust-lang.org/reference/attributes/testing.html)
- [Tokio testing guide](https://tokio.rs/tokio/topics/testing) for Tokio-specific projects
