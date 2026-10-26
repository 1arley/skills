## What it does

`grill-with-jev` turns an unresolved plan or design into rounds of decisions from JEV, the user's automated stand-in. Its script validates each response against a strict schema, tracks decision provenance, and marks risky or uncertain answers for the human.

JEV decides from the supplied profile and project context; it does not research. A real user confirms the final decision record before work begins unless the invocation explicitly says `--autonomous`.

## When to reach for it

You invoke this by typing `/grill-with-jev`, and the agent will not reach for it on its own. Use it when you explicitly want JEV to decide among design options. For a grilling session led directly by you, use [grilling](https://aihero.dev/skills-grilling).

## Prerequisites

A supported JEV provider and current model configuration are required for a live call. Each call can spend API credits. The TypeSafe path in this repository currently does not reserve its budget before the request, so do not rely on its configured cost ceiling to prevent an overage.

## A settled decision tree

Questions are asked in rounds. A dependent question waits until its prerequisite is settled, and an escalated answer cannot unlock the next branch. The final record keeps the decision, provenance, assumptions, and open risks together.

## Common questions

**Does JEV research the design?**

No. The host agent gathers project facts and supplies relevant Markdown context. JEV only decides from that context and the profile.

**When does the user need to answer?**

The human answers escalations, consent and budget questions, or corrections. The user also confirms the final decision record before implementation.

**Can dependent questions go in the same round?**

No. The next question waits for a settled answer to its dependency.

## It's working if

- Each round contains only questions whose dependencies are settled.
- Every accepted answer has provenance and a settled state.
- The final record is confirmed by the user before action, unless `--autonomous` was explicit.

## Where it fits

This is a standalone planning step before implementation. [decision-to-adr](https://aihero.dev/skills-decision-to-adr) can publish confirmed architecture decisions; [grilling](https://aihero.dev/skills-grilling) is the user-led alternative. [ask-matt](https://aihero.dev/skills-ask-matt) routes across the full skill set.
