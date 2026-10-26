# Input formats

The CLI uses remark positions to retain source line ranges. Use `--format grill`, `--format qa`, or `--format topics` to identify intent; `auto` is the default.

## grill-with-jev

The upstream skill documents a final `decision-record.md` but no canonical Markdown schema. The adapter accepts decision headings such as `## Use SQLite?`, optional `Context:`, `Question:`, `Options:`, `Outcome:`, `Rationale:`, `Consequences:`, `Provenance: jev|jev-subagent|user`, and `Confirmation: human: yes`. `❓` and `➡️` markers are supported as heading/label text. A section marked escalated/unanswered without an outcome becomes an open question. Source example:

```markdown
## Use SQLite?
Context: the utility must run offline.
Provenance: jev
Outcome: Use SQLite
Rationale: it is embedded.
```

This is a permissive mapping example, not an upstream guaranteed format. The JSONL audit contract has provenance and `settled`; the final Markdown record remains human-authored and shape-unspecified.

## Generic Markdown questions and answers

Use one level-one or level-two heading per question. Put `Answer:`, `Decision:`, or `Outcome:` in the section body. Add `Provenance:` and `Confirmation: human: yes` where known. A question without a settled answer is retained as open.

## Simple topic list

Use Markdown bullets or ordered list items; each item becomes a decision topic and its text is preserved as the stated outcome. This adapter does not infer trade-offs or rationale.
