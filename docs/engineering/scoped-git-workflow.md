## What it does

`scoped-git-workflow` creates a small set of coherent Conventional Commits and pushes the requested changes. It inspects staged, unstaged, and untracked work first, then stages only paths or hunks that belong to the task.

The defining constraint is preserving unrelated work. It does not stage everything, rewrite existing commits, or force-push to make a push succeed.

## When to reach for it

Type `/scoped-git-workflow`, or the agent reaches for it when you ask to commit and push code changes. Use it when a task needs a few reviewable commits with clear scope. For local changes without a requested push, follow the repository's normal commit workflow.

## Keep commit boundaries useful

Each commit should capture one coherent change area. Review the exact staged diff before committing, preserve unrelated staged work, and report the branch and remote when the push completes.

## Common questions

**Will it include every changed file?**

No. It separates task changes from pre-existing work and stages only the requested paths or hunks.

**Will it amend or force-push?**

No. It does not rewrite published history or force a push. If a normal push cannot succeed safely, it stops and reports the state.

## It's working if

- The staged diff contains only the requested work.
- Each commit has a clear Conventional Commit subject and a coherent scope.
- The push result is verified without rewriting unrelated history.

## Where it fits

This is a closeout step when the user has asked for both commits and a push. [code-review](https://aihero.dev/skills-code-review) checks the committed changes; [feature-orchestrator](https://aihero.dev/skills-feature-orchestrator) coordinates larger delivery stages. [ask-matt](https://aihero.dev/skills-ask-matt) routes across the full skill set.
