## What it does

`rust-performance` investigates CPU, allocation, memory, latency, throughput, and async overhead in Rust. It establishes a representative baseline, profiles to locate cost, and keeps an optimization only when measurement supports it.

The defining constraint is measurement before micro-optimization. A clone, allocation, or dynamic dispatch choice is not a bottleneck just because it looks expensive in isolation.

## When to reach for it

Type `/rust-performance`, or the agent reaches for it when you report a performance problem or profiling shows a bottleneck. For module and API design, use [rust-architecture](https://aihero.dev/skills-rust-architecture).

## Compare like with like

The workload, compiler, target, features, and build mode need to match the system that matters. In async code, include queue bounds, blocking work, and task coordination in the investigation. Correctness and supported targets remain constraints on any speedup.

## Common questions

**Should I add a benchmark before optimizing?**

Use the project's benchmark tools when they provide a representative workload. Add a new benchmark only when existing tools cannot answer the performance question.

**Is a small timing improvement enough?**

Not if it is within measurement noise. Repeat the comparison and report the workload, environment, and tradeoffs.

## It's working if

- A baseline and target metric exist before a code change.
- Profiling identifies the cost the change addresses.
- The report includes comparable before and after measurements and any tradeoff.

## Where it fits

This is a diagnosis and optimization reference for Rust. [rust-architecture](https://aihero.dev/skills-rust-architecture) checks structural tradeoffs; [rust-testing](https://aihero.dev/skills-rust-testing) covers test reliability for behavior changes. [ask-matt](https://aihero.dev/skills-ask-matt) routes across the full skill set.
