# decision-to-adr

Turn a decision record into numbered, provenance-preserving ADRs and an index.

## Install

Copy this folder into the directory your agent reads skills from. The bundled CLI needs Node.js 22 or newer and has no runtime dependencies, so it runs without an install step.

```sh
node scripts/decision-to-adr.mjs generate --input decision-record.md
```

The first run is a dry-run: it prints the planned diff and writes nothing. Add `--write` only after you review that diff and approve it.

## Privacy

The CLI runs locally and offline. It reads the input file and the ADR directory, never calls a network service or a model, and never invokes a shell. Nothing is uploaded and no telemetry is collected. Decision records stay on your machine.

## Remove

Delete this folder, or remove it with the agent's skill manager. The CLI has no settings, credentials, or background processes to clean up. Remove the root `scripts/decision-to-adr.mjs` bundle too if you only want the skill instructions.

## Security

Run the dry-run and read the complete diff before `--write`. Paths must resolve inside the repository root: traversal and outward symlinks are rejected, writes take an exclusive lock, and existing ADRs are never overwritten. Read [references/security.md](references/security.md) for the trust model and the repository `SECURITY.md` for the reporting policy.
