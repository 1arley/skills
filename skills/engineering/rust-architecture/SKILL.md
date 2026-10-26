---
name: rust-architecture
description: >
  Place Rust code at useful crate and module boundaries, design public APIs,
  handle errors, and evaluate runtime or unsafe choices. Use when a change
  affects structure or long-term interfaces, not for routine local edits.
---

# Rust architecture

Use this skill when a change crosses modules or crates, establishes a public API, selects an execution model, or adds a long-lived abstraction.

## Map the existing design

Read workspace manifests, package boundaries, feature flags, public exports, binary/library split, error types, and neighboring implementations. Check the project's MSRV and compatibility policy. Prefer the smallest boundary that gives the change a clear owner; don't introduce a workspace, layer, service abstraction, or trait solely because it is a familiar pattern.

## Crates, modules and APIs

- Keep implementation details private by default. Expose public items for real consumers, and document behavior, errors, invariants, feature requirements, and examples.
- Use crate boundaries when independent reuse, compile-time isolation, ownership, or dependency direction benefits are concrete. Modules are usually enough to organize code within one package.
- Design APIs around caller needs. Follow Rust API Guidelines for naming, conversions, collections, errors, and interoperability, while respecting the crate's existing compatibility promises.
- Avoid public types or trait abstractions that make simple use harder. Conversely, don't hide meaningful domain states in strings or loosely structured maps when typed data improves correctness.
- Treat feature flags as part of the public surface: check combinations, defaults, and downstream impact before adding or changing them.

## Errors and boundaries

Use domain-specific errors where callers need to distinguish or handle failures. At an application boundary, add context that helps operators or users act. Keep low-level source errors available for diagnosis. Separate invalid input, expected absence, environmental failure, and violated internal invariants where that distinction affects behavior.

Choose sync or async based on the actual I/O and concurrency model. Async has ecosystem and complexity costs: runtime ownership, `Send` constraints, cancellation, and shutdown. Reuse the existing runtime in a service. A library should avoid forcing an executor unless async execution is essential to its API; document runtime requirements and avoid hidden runtime creation.

## State and concurrency

Represent domain invariants in types when that makes invalid states difficult to construct and the API remains understandable. Avoid elaborate typestate for short-lived internal flows. Use ownership and message passing when they make shared-state behavior easier to reason about; don't ban locks. Bound queues and concurrent work when inputs or workloads can grow.

## Unsafe code

Avoid `unsafe` unless safe Rust cannot express the required behavior or measured constraints justify it. Before accepting it, identify the exact unsafe operation, its preconditions, aliasing/lifetime/thread-safety invariants, and who upholds them. Keep unsafe blocks narrow, put a `// SAFETY:` explanation next to each block, and provide tests or tools appropriate to the invariant. Consult the Rustonomicon and the relevant standard-library safety contract; comments do not prove soundness.

## Change management

Prefer an incremental change that follows local design. If the task requires a new boundary, explain the concrete pressure it addresses, the alternatives considered, and the effect on callers, build time, features, and compatibility. Keep unrelated module moves and renames out of the patch.

## References

- [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
- [Rust Book: packages, crates and modules](https://doc.rust-lang.org/book/ch07-00-managing-growing-projects-with-packages-crates-and-modules.html)
- [Cargo workspaces](https://doc.rust-lang.org/cargo/reference/workspaces.html)
- [Rustonomicon](https://doc.rust-lang.org/nomicon/)
- [Rust Reference](https://doc.rust-lang.org/reference/)
