---
name: laws-of-ui
description: Audit existing web pages from live interfaces, screenshots, prototypes, or source code, and plan new pages with practical guidance grounded in Laws of UI. Use for UI critiques, redesigns, and page specifications; not general code review.
---

# Laws of UI

Give specific, evidence-aware guidance for a web interface or flow. Use the Laws of UI as explanatory lenses, not universal rules or substitutes for user research, usability testing, or accessibility standards.

## Route the request

- **Audit an existing page or flow** (live site, screenshot, prototype, or source): read [references/audit-workflow.md](references/audit-workflow.md).
- **Plan a page or flow that does not exist yet:** read [references/new-page-workflow.md](references/new-page-workflow.md).
- **Redesign an existing interface:** read both workflow references; distinguish observed problems from proposed changes.
- **Review one component or interaction:** use only the relevant parts of the audit workflow and references.
- Read [references/ux-principles.md](references/ux-principles.md) when a principle helps explain a specific finding or design choice. Do not force a law name into every recommendation.
- When the request includes accessibility evaluation or interactive semantics, read [references/accessibility-checks.md](references/accessibility-checks.md).

If the request mixes modes, cover each requested mode. If key context is missing, state a reasonable assumption and continue when possible; ask only when the answer would materially change the work.

## Ground rules

- Anchor each critique in the supplied page, code, screenshot, flow, or stated requirement. Separate observations from inferences; never invent analytics, user research, or behavior you could not inspect.
- Use available browser or visual-inspection tools for runtime claims. If only source or a static image is available, say so and do not imply that you tested the running interface.
- Connect recommendations to the user's task and likely impact. Explain tradeoffs when a change helps one group or task but may hurt another.
- Preserve useful conventions, existing design systems, and product constraints. Familiarity can aid recognition, but copying another product is not evidence that a pattern fits this audience.
- Consider the full interaction: entry point, content hierarchy, decisions, controls, loading, success, empty, and error states, plus responsive behavior where relevant.
- Treat accessibility as part of usability. Use WCAG as the testable standard when making a conformance claim; a quick visual review is not a conformance audit.
- If asked to implement recommendations, first follow the project's existing components and visual tokens; make only the requested changes and verify the affected flow at the available viewport and states.

## Deliver useful output

For an audit, lead with the main usability risks, then give prioritized findings with location, evidence, user impact, a concrete change, and a way to validate it. For a new page, give a concise page blueprint: audience and task assumptions, content order, primary action, key interactions and states, and responsive/accessibility notes. Scale the detail to the request. Do not implement changes unless asked.
