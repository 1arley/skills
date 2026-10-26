# Accessibility checks for UI work

Load this reference when the user asks for an accessibility review, when an interaction's keyboard or assistive-technology behavior is in scope, or when a design decision depends on an accessibility criterion.

## Use the right source

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) is the normative standard. Cite a specific success criterion when reporting a likely failure; state the level (A, AA, or AAA) and the evidence checked.
- W3C's [Understanding WCAG](https://www.w3.org/WAI/WCAG22/Understanding/) pages explain criteria and examples but are informative, not additional requirements.
- The [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) gives recommended patterns for custom widgets. Prefer native HTML controls when they provide the needed behavior; adding ARIA does not create keyboard behavior by itself.

## Match checks to the interface

- **Keyboard and focus:** operate the full task without a pointer; confirm focus is visible, moves in a sensible order, is not trapped unintentionally, and is not hidden behind sticky or overlay content. See [Keyboard (2.1.1)](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) and [Focus Not Obscured (Minimum) (2.4.11)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html).
- **Names and semantics:** check that controls have meaningful accessible names, labels are associated with inputs, headings and landmarks describe the page structure, and custom widgets expose the right roles, states, and keyboard interactions. See [WAI-ARIA APG practices](https://www.w3.org/WAI/ARIA/apg/practices/).
- **Contrast and meaning:** measure text contrast rather than estimating from a screenshot; check that color is not the sole way to identify an error, status, or action. WCAG 2.2 AA's contrast minimum is generally 4.5:1 for normal text and 3:1 for large text, with defined exceptions. See [Contrast Minimum (1.4.3)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) and [Use of Color (1.4.1)](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html).
- **Target size:** WCAG 2.2 AA criterion 2.5.8 generally requires pointer targets to be at least 24 by 24 CSS pixels or meet its spacing rule; several exceptions apply. See [Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html). Larger targets can still improve usability beyond the minimum.
- **Reflow and zoom:** check that content and controls remain available when zoomed and at a narrow viewport; distinguish an actual criterion failure from a visual preference. See [Reflow (1.4.10)](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).
- **Motion:** when animation is present, honor the user's reduced-motion preference when the platform exposes it. See MDN's [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).
- **Forms and status:** inspect programmatic labels, required-field cues, actionable error messages, error association, and whether important dynamic updates are announced.

## Report limits clearly

Name the page, viewport, state, and input method actually checked. A screenshot can reveal visible contrast, hierarchy, and layout concerns, but cannot establish keyboard behavior, accessible names, or WCAG conformance. Automated scans can help find some issues but do not establish conformance on their own. If a check could not be performed, mark it unverified rather than passing it by assumption.
