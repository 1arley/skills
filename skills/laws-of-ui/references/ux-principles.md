# Laws of UI: practical lenses

The [Laws of UI collection](https://uilaws.com/) presents the principles below as ways to reason about interface perception and interaction. These notes paraphrase that collection and turn each item into a review prompt. A named law is a heuristic, not proof that a design works or a requirement every page must satisfy.

## Visual structure

- **Symmetry:** balanced arrangements can feel unified. Use symmetry to support order, and break it when the task needs stronger hierarchy or direction.
- **Rule of thirds:** a 3-by-3 composition can help place focal content. Treat it as a layout prompt, not a grid every page must follow.
- **White space:** spacing can improve focus and readability. Use it to clarify grouping; too much or poorly placed space can disconnect related content.
- **Color theory:** color combinations carry visual and cultural associations. Check the product context and never use color as the only signal for meaning.
- **Typography hierarchy:** differences in type size and style can show importance and reading order. Keep levels consistent and readable.
- **Contrast:** visual difference can draw attention and separate elements. Reserve strong emphasis for meaningful priority; verify text and control contrast against WCAG rather than judging by appearance alone.
- **Consistency:** repeated patterns help users recognize how similar elements work. Keep equivalent controls and states consistent unless a meaningful difference needs to be visible.

## Grouping and perception

- **Proximity:** nearby elements are often perceived as related. Align spacing with the actual relationship between labels, inputs, actions, and content.
- **Closure:** people can perceive a complete shape from partial visual information. Do not let decorative incompleteness make controls or status unclear.
- **Continuity:** aligned elements can appear connected or follow a path. Use alignment to support reading and sequence without implying a false relationship.

## Choices and interaction

- **Fitts's Law:** larger and closer targets are generally easier to acquire. Inspect size, spacing, and placement, especially for frequent or touch-operated controls; use WCAG for formal target-size claims.
- **Hick's Law:** more numerous or complex choices can take longer to decide among. Make options understandable and meaningfully grouped; do not hide useful choices just to reduce their count.
- **Jakob's Law:** familiar conventions can reduce the effort of learning an interface. Follow patterns that fit the audience and task, while preserving the product's own mental model where it differs for a reason.

## Sources

- [Laws of UI](https://uilaws.com/) — primary source for this skill's named visual and interaction principles.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — normative accessibility requirements; see [accessibility-checks.md](accessibility-checks.md) for relevant checks.
