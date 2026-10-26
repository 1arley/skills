---
name: decision-to-adr
description: Turns a decision record into numbered, provenance-preserving ADRs and an index. Use when the user asks to publish decisions as ADRs, write ADRs from the grill session, generate an ADR, document architecture decisions, or convert decision-record.md to docs/adr.
disable-model-invocation: true
---

# Convert a decision record into ADRs

1. Locate the supplied decision record and the repository's ADR directory (default `docs/adr/`). Read [input-formats.md](references/input-formats.md) if the source shape is unclear.
2. Run the bundled CLI in dry-run mode. Choose MADR by default; use Nygard or Y-statement only when requested. Review `--json` or use `explain` to inspect mapping.
3. Show the complete planned diff to the user and ask for confirmation before writing. The CLI itself never asks or invokes an LLM.
4. After confirmation, run the same command with `--write`. Report created files, proposed decisions, open questions, and preserved manual edits.

```sh
node scripts/decision-to-adr.mjs generate --input decision-record.md
node scripts/decision-to-adr.mjs generate --input decision-record.md --write
```

Use `--confirmed` only after the human explicitly confirms the recorded decisions. A record that lacks a confirmation marker otherwise stays `proposed`: JEV and sub-agent outputs are recommendations, not human approval. The original provenance is retained in frontmatter and body. Escalated unanswered questions do not become decisions; keep them in the implementation spec and index. Read [status-rules.md](references/status-rules.md), [security.md](references/security.md), and [spec-guidance.md](references/spec-guidance.md) for those operations.

The CLI defaults to dry-run, never shells out, confines writes to the repository, uses a lock for `--write`, and preserves edited ADRs by creating a `.generated.md` sibling. It does not invent decisions or resolve open questions. See [templates.md](references/templates.md) for output formats.

## Worked example

Input:

```markdown
## Use SQLite?
Context: the tool must work offline.
Provenance: jev
Outcome: Use SQLite
Rationale: a local database fits offline use.
```

Output excerpt:

```markdown
---
id: 0001
status: proposed
decided-by: jev
confirmed-by-human: false
---

> **Decision decided by persona, not yet confirmed by a human.**
```

## Supporting references

- [Input formats](references/input-formats.md)
- [Templates](references/templates.md)
- [Status and provenance](references/status-rules.md)
- [Spec guidance](references/spec-guidance.md)
- [Security](references/security.md)
