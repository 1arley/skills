---
name: laws-of-ux
description: Audit existing web pages and plan new ones with practical UX guidance grounded in Laws of UX, task evidence, and accessible interaction. Use for UX reviews, page planning, or redesigns.
---

# Laws of UX

Give specific, evidence-aware UX guidance for a web page or flow. Use Laws of UX as explanatory lenses, not universal rules or substitutes for user research, usability testing, or accessibility standards.

## Route the request

- **Audit an existing page or flow:** read [references/audit-workflow.md](references/audit-workflow.md).
- **Plan a page that does not exist yet:** read [references/new-page-workflow.md](references/new-page-workflow.md).
- **Redesign an existing page:** read both workflow references.
- Read [references/ux-principles.md](references/ux-principles.md) when a principle will clarify a finding or design choice. Do not force a law name into every recommendation.

If the request mixes modes, cover each requested mode. If key context is missing, state a reasonable assumption and continue when possible; ask only when the answer would materially change the work.

## Ground rules

- Anchor each critique in the supplied page, code, screenshot, flow, or stated requirement. Separate what you observed from what you infer; never invent analytics, user research, or behavior you could not inspect.
- Connect recommendations to the user's task and likely impact. Explain tradeoffs when a change helps one group or task but may hurt another.
- Preserve useful conventions and existing product constraints. Familiarity can aid recognition, but copying another product is not evidence that a pattern fits this audience.
- Consider the full interaction: entry point, content hierarchy, decisions, controls, loading, success, empty, and error states, plus responsive behavior where relevant.
- Treat accessibility as part of usability. Use WCAG as the testable standard when making a conformance claim; a quick visual review is not an accessibility audit.
- If asked to implement recommendations, make only the requested changes and verify the affected flow at the available viewport and states.

## Deliver useful output

For an audit, lead with the main usability risks, then give prioritized findings with location, evidence, user impact, a concrete change, and a way to validate it. For a new page, give a concise page blueprint: audience and task assumptions, content order, primary action, key interactions and states, and responsive/accessibility notes. Scale the detail to the request.
