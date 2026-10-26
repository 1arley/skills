---
name: scoped-git-workflow
description: Create semi-granular, scope-preserving Conventional Commits and push them to the current Git remote when the user asks to commit and push code changes.
---

# Scoped Git workflow

Use this skill when the user asks to commit and push work, especially with instructions such as “semi-granular”, “keep the changes in scope”, or “use semantic commits”. Produce a small set of coherent commits that captures the requested work without absorbing unrelated changes.

## Inspect before staging

- Check the current branch, upstream, worktree status, staged diff, unstaged diff, untracked files, and recent commit subjects. Read enough of each changed file to understand its purpose.
- Separate changes made for the current request from pre-existing or unrelated work. Preserve the latter; do not stage, amend, reset, stash, or otherwise rewrite it.
- Review staged changes separately. If the index already contains unrelated user work, leave it intact and stage only the requested paths or hunks. Never use `git add -A` or `git add .` when scope is mixed.
- Check candidate files for credentials, local configuration, generated output, or unrelated edits before staging. Do not commit secrets; ask only if a necessary file has ambiguous sensitive content.
- Follow the repository's commit conventions when they are clear. Otherwise use Conventional Commits: `type(scope): imperative summary`, with a concise subject in the repository's usual language. Common types include `feat`, `fix`, `test`, `build`, `ci`, `docs`, `refactor`, and `chore`.

## Choose commit boundaries

Make one commit per coherent change area or reviewable outcome. Keep tightly coupled implementation and tests together; separate independent docs, CI, tooling, or feature changes when each can be understood and reviewed on its own. “Semi-granular” means a few meaningful commits, not one per file and not one omnibus commit. Do not split a change just to create more commits.

Before each commit, inspect exactly what is staged and confirm it belongs to that commit. Use a semantic subject that explains the change, not the act of editing. Do not amend existing commits unless the user specifically asks.

## Commit and push

- Commit only the requested, reviewed changes. If there is no in-scope change, say so instead of creating an empty commit.
- Push the resulting commits to the current branch's configured upstream. If none exists, inspect remotes and branch state; do not guess a branch or remote when more than one is plausible.
- Never force-push, rewrite published history, change remotes, or push unrelated existing commits as a side effect. If the current branch is behind or diverged such that a normal push would fail, stop and report the state rather than rewriting history.
- Afterward, verify the commit list and push result, and report the commit subjects, branch, and remote. Mention any pre-existing changes left untouched.
