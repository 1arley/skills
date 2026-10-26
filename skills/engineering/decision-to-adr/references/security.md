# Security and file safety

Run the dry-run and inspect its complete diff before `--write`. Input and output paths must resolve inside the repository root. The apply phase rejects traversal and outward symlinks, acquires `.decision-to-adr.lock`, and creates ADR files exclusively. Existing ADRs are never overwritten; manual edits cause a `.generated.md` sibling. Do not pass untrusted paths from outside the project. The CLI does not use a shell, network, or LLM.
