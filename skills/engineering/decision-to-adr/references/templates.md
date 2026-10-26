# Output templates

Select with `--template madr|nygard|y-statement`.

- **MADR** (default): context/problem, considered options, outcome, consequences, provenance, references.
- **Nygard**: context, decision, consequences, in the concise form introduced by Michael Nygard.
- **Y-statement**: one sentence expressing decision, context, alternatives, rationale, and consequences, followed by readable context.

All variants retain YAML frontmatter with status, date, source hash, provenance, confirmation, and source line locator. Optional fields are omitted when unavailable; the tool does not fabricate alternatives.
