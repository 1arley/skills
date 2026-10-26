## What it does

`ruby-style` helps write and review Ruby using clear names, focused methods, appropriate exceptions, and readable collection operations. It compares common style guides and gives a practical way to resolve disagreements.

The defining constraint is precedence: the project's enforceable conventions and local choices take priority over a detached style preference.

## When to reach for it

Type `/ruby-style`, or the agent reaches for it when writing or reviewing Ruby or answering a style question. Use it for general Ruby choices; for test design and failures, use [ruby-testing](https://aihero.dev/skills-ruby-testing).

## Resolve style conflicts

Prefer a repository convention when one exists. Otherwise choose the option that makes behavior easiest to read and maintain, without rewriting working code for stylistic uniformity alone.

## Common questions

**Which style guide wins when guides disagree?**

Follow the repository's established and enforced rules first. When it has no rule, use the skill's precedence guidance and explain a tradeoff only when it affects the code.

**Should I rewrite valid code to match a preferred idiom?**

Only when the change improves clarity, correctness, or maintainability. Avoid style-only churn.

## It's working if

- Names and method boundaries make the code's behavior easy to follow.
- Exceptions preserve useful failure information and reflect the caller's boundary.
- The diff avoids unrelated rewrites of already clear code.

## Where it fits

This is an anytime reference for Ruby code. [ruby-testing](https://aihero.dev/skills-ruby-testing) focuses on test boundaries and reliability; [code-review](https://aihero.dev/skills-code-review) checks a diff against local standards and its spec. [ask-matt](https://aihero.dev/skills-ask-matt) routes across the full skill set.
