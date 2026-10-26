## What it does

`ruby-testing` helps design and debug Ruby tests with either RSpec or Minitest. It covers test boundaries, isolation, fixtures and factories, integration tests, order dependence, and failure diagnosis.

The defining constraint is to inspect the repository's test setup first. RSpec and Minitest have similar concepts but different APIs, and a familiar example can be wrong for the project.

## When to reach for it

Type `/ruby-testing`, or the agent reaches for it when writing or debugging tests in a Ruby project. For production Ruby conventions outside tests, use [ruby-style](https://aihero.dev/skills-ruby-style).

## Test the behavior at its boundary

Use unit tests for private details that need them and integration tests for behavior visible to callers. Keep fixtures explicit and tests independent of execution order, global state, and external services unless those are the subject of the test.

## Common questions

**Should I use factories or fixtures?**

Use the approach already established in the project. Factories help when each test needs a tailored object; fixtures can be simpler for shared, stable data.

**Why does a test pass alone but fail in the suite?**

Look for shared mutable state, order dependencies, global configuration, and cleanup that only occurs on the success path.

## It's working if

- The test uses the framework and helpers already present in the project.
- Assertions focus on observable behavior and relevant boundary cases.
- The test passes regardless of suite order and does not depend on live services.

## Where it fits

This is an anytime test-design and diagnosis reference for Ruby. [ruby-style](https://aihero.dev/skills-ruby-style) covers production code conventions; [feature-orchestrator](https://aihero.dev/skills-feature-orchestrator) can coordinate a larger feature's verification stages. [ask-matt](https://aihero.dev/skills-ask-matt) routes across the full skill set.
