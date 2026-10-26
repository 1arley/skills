---
name: rust-performance
description: >
  Investigate or improve Rust performance with measurement first. Use for
  profiling CPU, allocations, memory, latency, throughput, or async overhead;
  do not apply micro-optimizations without evidence.
---

# Rust performance

Use this skill when a task names a performance problem or profiling shows a bottleneck. Treat correctness and the project's supported targets as constraints.

## Establish a baseline

1. Find a representative workload and define the metric that matters: latency distribution, throughput, peak memory, binary size, or startup time.
2. Record the current result with the same compiler, target, features, input, and build mode that matter in production.
3. Profile before changing code. Separate time in the program from time in I/O, dependencies, startup, or the benchmark harness.
4. Make one focused change, rerun correctness checks, and compare against the baseline. Keep the change only if it improves the target metric without unacceptable costs elsewhere.

Use the project's existing benchmark and profiling tools. For a new benchmark, prefer a reproducible end-to-end workload over tiny synthetic loops that optimize away or fail to represent production. Avoid adding `criterion`, an allocator, or a profiling dependency without a reason.

## Common costs to investigate

- Repeated allocation, copying, parsing, formatting or conversion in a hot path.
- Unnecessary cloning or collecting into an intermediate `Vec` when a borrow or streaming pass expresses the same behavior clearly.
- Poor data layout or algorithmic complexity. Fix repeated work and asymptotic costs before instruction-level tuning.
- Unbounded queues, task creation, buffering, or concurrency that increases memory use or tail latency.
- Lock contention, blocking work on an async executor, and excessive cross-thread coordination.
- Expensive serialization, logging, or error-context construction on the hot path.

These are hypotheses to measure, not automatic defects. A clone may simplify ownership and be cheap for the actual type; an intermediate collection may improve clarity or avoid repeated computation.

## Rust-specific guidance

- Prefer safe code. Don't introduce `unsafe`, custom allocators, manual SIMD, or lock-free structures without measured need and a documented safety/performance case.
- Consider generics and static dispatch when they materially help hot paths. Dynamic dispatch is often the better choice for simpler APIs, smaller code, or heterogeneous data.
- Use `Cow`, arenas, pooling, or custom data structures only when profiles show a relevant allocation or ownership cost and the added complexity is justified.
- Test release builds and the production target. Debug timings are not representative. Preserve overflow, panic, feature, and platform behavior when changing profiles or compiler settings.
- In async code, bound concurrency and queues, keep blocking work off the runtime workers, and measure task/communication overhead. Runtime advice must match the project's executor.

## Report the result

State the workload and environment, the before/after measurement, and any tradeoff in memory, code complexity, binary size, or portability. If the result is within measurement noise, say so; don't claim an optimization from a single unstable run.

## References

- [Rust Performance Book](https://nnethercote.github.io/perf-book/)
- [Cargo profiles](https://doc.rust-lang.org/cargo/reference/profiles.html)
- [Rust compiler optimization options](https://doc.rust-lang.org/rustc/codegen-options/index.html)
- [Tokio `spawn_blocking`](https://docs.rs/tokio/latest/tokio/task/fn.spawn_blocking.html)
