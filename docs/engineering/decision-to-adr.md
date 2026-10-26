## What it does

`decision-to-adr` turns a decision record into numbered Architecture Decision Records and an index while preserving who made each decision and what remains open. It defaults to MADR, and its first pass is a dry run that shows the proposed mapping before it writes.

A recommendation from a model or another agent stays proposed until a human confirms it. The tool does not invent decisions to fill gaps.

## When to reach for it

You invoke this by typing `/decision-to-adr`, and the agent will not reach for it on its own. Use it when you have a decision record that should become durable architecture documentation. For an unresolved design discussion, use [grill-with-jev](https://aihero.dev/skills-grill-with-jev) when you explicitly want JEV to decide.

## Proposed before written

The dry run lets you inspect how source decisions map to ADRs. Approve the planned diff before passing `--write`. Pass `--confirmed` only for decisions a human has confirmed; model recommendations without that marker keep `proposed` status. Unanswered escalations stay open in the implementation spec and index, not as decisions. Existing edited ADRs are preserved, with generated updates written beside them for review.

## Common questions

**Should every discussion become an ADR?**

No. Use an ADR for a decision with lasting architectural consequences. The skill preserves open questions instead of presenting them as settled choices.

**Does the tool write immediately?**

No. It shows the planned diff first. After you approve that plan, the write command uses `--write`; `--confirmed` separately marks human-confirmed decisions in the output.

**Can I use an existing ADR format?**

Yes. MADR is the default; Nygard and Y-statement formats are available when requested.

## It's working if

- The dry run shows the proposed ADRs and index before any file changes.
- The output preserves decision provenance and leaves unresolved questions open.
- Existing manual ADR edits remain intact.

## Where it fits

This is a documentation step after a decision has been made, not a way to interview people or decide for them. [grill-with-jev](https://aihero.dev/skills-grill-with-jev) helps settle a design when explicitly requested; [code-review](https://aihero.dev/skills-code-review) checks the implementation against its accepted record. For broader routing, see the [ask-matt page on aihero.dev](https://aihero.dev/skills-ask-matt).
