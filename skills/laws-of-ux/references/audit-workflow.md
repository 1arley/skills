# Audit an existing page or flow

Use this workflow when a page, prototype, screenshot, running app, or existing implementation is available.

## Establish scope and evidence

1. Identify the page or flow, its likely audience, the main task, and any stated business or technical constraints. Mark assumptions when these are not supplied.
2. Inspect the strongest available evidence: interact with the running page when possible; otherwise inspect the provided screenshots, prototype, or relevant source. State what you could not inspect. Do not claim behavior from source code alone if runtime behavior is unknown.
3. Follow the primary task from entry to completion. Check the relevant alternate paths, including validation errors, loading, empty, success, and recovery states when available.
4. Compare desktop and narrow/mobile layouts when the page is responsive or the task involves touch. Record the viewport or device context for layout-specific findings.

## Evaluate the experience

Look for issues that change task success, effort, confidence, or access:

- **Orientation:** Is the page's purpose clear? Can users identify where they are and what to do next?
- **Hierarchy and attention:** Does the visual and content order support the main task? Do competing elements or weak grouping obscure relationships?
- **Choices and cognitive effort:** Are options understandable and meaningfully grouped? Is complexity staged without hiding necessary choices?
- **Learnability and consistency:** Do controls match their labels and common expectations? Are familiar patterns preserved where they help this audience?
- **Interaction and feedback:** Are controls discoverable and operable? Does the interface acknowledge actions and explain delays, results, or failures?
- **Forms and recovery:** Are labels, instructions, validation, errors, and recovery steps clear and close to the affected input?
- **Accessibility:** Where tools permit, check keyboard operation and visible focus, semantic structure and names, contrast, zoom/reflow, target size and spacing, and status/error announcements. Report the checks actually performed; use the current WCAG criteria for claims of nonconformance.
- **Responsive fit:** Does content remain readable and usable without clipped controls, unnecessary horizontal scrolling, or touch-specific obstacles?

Use only the checks relevant to the page and available evidence. These are prompts for inspection, not a claim that an automated or brief review proves usability or accessibility.

## Write findings

Prioritize by task impact, reach, and likelihood; do not create false precision with an unsupported numeric score.

- **Critical:** a core task is blocked, or the design makes a consequential mistake likely and difficult to recover from.
- **High:** a common or important task has substantial friction, confusion, or an access barrier.
- **Moderate:** a meaningful task requires avoidable effort or has a recoverable source of confusion.
- **Low:** a localized refinement with limited task impact.

For each finding include:

1. **Priority and location** — the screen area, step, control, or viewport.
2. **Evidence** — what is visible or reproducible, and the conditions under which it occurs.
3. **User impact** — which task or user need is affected and how.
4. **Recommendation** — a concrete change, not a general direction such as “make it cleaner.”
5. **Validation** — a task to retry, state to inspect, accessibility criterion to verify, or user question to test.

Label an interpretation as a hypothesis when direct evidence is unavailable. Mention a relevant Laws of UX principle only when it helps explain the mechanism; see [ux-principles.md](ux-principles.md). Avoid treating aesthetic appeal, convention, or a named law as proof of usability.

## Suggested response shape

```markdown
## Summary
One or two sentences on the main task and highest-impact risk.

## Findings
### [Priority] Finding title — location
- Evidence:
- User impact:
- Recommendation:
- Validate:

## Scope and assumptions
What was inspected, what was unavailable, and assumptions that affect confidence.
```

Omit empty sections and keep the report proportional to the request.
