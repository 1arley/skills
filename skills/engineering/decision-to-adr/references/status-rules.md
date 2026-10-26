# Status and provenance

- Explicit human confirmation or `--confirmed` yields `accepted`.
- Without confirmation, `jev` and `jev-subagent` decisions are `proposed` and visibly labeled as unconfirmed persona decisions.
- Human provenance alone is not proof that the final record was confirmed; absent evidence remains proposed.
- Unknown provenance remains `proposed` unless the human uses `--confirmed`.
- An escalated unanswered question does not produce an ADR. It appears as an open question in the index and, with `--spec`, the spec.
- Provenance is written to frontmatter and the ADR body without replacement or inference from the author identity.
