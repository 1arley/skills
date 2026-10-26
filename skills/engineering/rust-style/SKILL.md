---
name: rust-style
description: >
  Write or review idiomatic Rust by following the repository's conventions for
  ownership, errors, naming, documentation, formatting, and linting. Use for
  general Rust code; use focused async or unsafe guidance when those are central.
---

# Rust style

Use this skill when writing or reviewing general Rust code. The goal is clear, idiomatic code that fits its crate, not conformity to a detached style preference.

## Start with the repository

Before suggesting a style change, inspect the relevant `Cargo.toml` files, `rust-toolchain.toml`, `rustfmt.toml` or `.rustfmt.toml`, Clippy configuration, CI commands, MSRV policy, and nearby code. Run the project's configured formatter and lints when requested. Preserve its edition, MSRV, public API, feature choices and established conventions.

## Idioms that usually help

- Accept borrowed inputs (`&str`, `&[T]`, `&Path`) when the function only reads them. Take ownership when storing, transforming, or returning the value. Don't add lifetimes or `Cow` until they solve an observed API or allocation problem.
- Make fallible operations return `Result`; represent expected absence with `Option`. Reserve `panic!`, `expect` and `unwrap` for tests, examples, or invariants whose violation truly means the program cannot continue. Give `expect` a useful invariant message.
- Use `?` to propagate errors when the caller can act on them. Add context or translate errors at a boundary where it improves diagnosis; don't erase useful source errors.
- Prefer exhaustive `match` when cases need distinct behavior. Use `if let` or `let ... else` for a single case. Prefer iterators when they make transformations clearer, not as a rule against readable loops.
- Use names that describe domain meaning. Follow Rust naming conventions (`UpperCamelCase` types/traits, `snake_case` functions/modules, `SCREAMING_SNAKE_CASE` constants) unless a generated API or external contract requires otherwise.
- Keep comments focused on why a non-obvious choice exists. Use `///` docs for public API behavior, constraints, errors and examples. Verify examples as doctests when practical.
- Use `#[derive]` for semantics that are genuinely correct for the type. Do not derive `Copy`, equality, ordering, or serialization merely for convenience.

## Errors and panics

Choose error types to match the boundary. Libraries commonly benefit from typed, inspectable errors; applications may use an error-reporting crate to add context at the top level. This is a design choice, not a universal `thiserror` versus `anyhow` rule. Preserve error sources and avoid converting every failure into a string too early.

Don't mechanically remove every `unwrap()`: first determine whether the input is untrusted, whether the invariant is established locally, and how the failure should be reported. Conversely, don't use `unwrap()` in production paths to silence a fallible API.

## Formatting and lints

Use `rustfmt` and the project's Clippy policy rather than hand-formatting. Treat warnings according to the repository's configured toolchain and CI. Don't add crate-wide `deny` attributes, lint suppressions, or new tooling as part of an unrelated patch. If an allow is needed, scope it narrowly and explain why; do not suppress a lint without understanding it.

## Avoid style-only churn

Don't rewrite working code merely to replace loops with iterators, `match` with combinators, owned values with borrowed ones, or one valid naming choice with another. Make a style change when it improves correctness, clarity, API quality, or the project's stated conventions.

## References

- [Rust Book: common programming concepts](https://doc.rust-lang.org/book/ch03-00-common-programming-concepts.html)
- [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
- [Clippy lints](https://rust-lang.github.io/rust-clippy/master/)
- [Rust standard library](https://doc.rust-lang.org/std/)
