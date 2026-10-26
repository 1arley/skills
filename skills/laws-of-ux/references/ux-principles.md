# Laws of UX: practical lenses

These short notes paraphrase the current [Laws of UX collection](https://lawsofux.com/laws/), checked on 2026-10-11. Use a principle to explain a plausible mechanism behind an observed problem or design choice. A principle alone does not establish that a particular interface is good or bad.

## Decisions, effort, and memory

- **Hick's Law** — More or more complex choices can increase decision time. Useful for examining choice sets and decision points. Do not remove meaningful options without understanding the task. [Source](https://lawsofux.com/hicks-law/)
- **Choice Overload** — A large set can feel difficult to evaluate. Check how options are named, grouped, filtered, and compared; do not assume a fixed maximum number.
- **Cognitive Load** — Interfaces consume mental effort. Reduce effort that does not help the task, while keeping necessary information available.
- **Chunking** — Group related information into meaningful units. Groups should reflect the task and content, not arbitrary visual decoration.
- **Miller's Law / Working Memory** — Users must hold some information in mind while acting. Support recognition, comparison, and external memory. Do not use “7 ± 2” as a universal cap on navigation items or options; the Laws of UX page itself cautions against the “magical number seven” and notes context and individual differences. [Source](https://lawsofux.com/millers-law/)
- **Serial Position Effect** — First and last items may be more memorable. Consider placement for important choices, but do not rely on position as the only signal.
- **Selective Attention** — People focus on stimuli relevant to their goals. Keep task-critical information visible and avoid competing emphasis.

## Interaction and learnability

- **Fitts's Law** — A target is easier to acquire when it is larger and closer to the current point of interaction. Inspect size, spacing, and placement, especially for touch. Use WCAG or platform guidance for formal target-size requirements. [Source](https://lawsofux.com/fittss-law/)
- **Jakob's Law / Mental Models** — Familiar patterns can reduce learning effort because people bring expectations from other products. Preserve conventions when they fit; do not copy a pattern that conflicts with the user's task or product model.
- **Paradox of the Active User** — People often begin acting before reading instructions. Make the next step legible in context and make errors recoverable.
- **Postel's Law** — The collection presents a principle about accepting and sending information. For UX, prioritize clear, forgiving input and clear output; never use this as a reason to accept unsafe, invalid, or ambiguous data silently.
- **Tesler's Law** — Some complexity is inherent in a task. Decide where it belongs; do not simply transfer it to users or hide it from them.

## Perception and visual structure

- **Proximity, Common Region, Similarity, and Uniform Connectedness** — Spacing, boundaries, visual similarity, and connecting cues shape which elements people perceive as related. Make visual grouping match functional relationships.
- **Prägnanz** — People tend to perceive a simpler organization in ambiguous forms. Prefer clear structure, but do not remove detail users need to distinguish options.
- **Aesthetic-Usability Effect** — Visual appeal can influence perceived usability. Treat polish as valuable, but inspect task performance separately; attractive design can mask usability problems. [Source](https://lawsofux.com/aesthetic-usability-effect/)
- **Von Restorff Effect** — A distinct item can stand out among similar items. Reserve contrast for meaningful priority; too many standout items compete.

## Progress, timing, and remembered experience

- **Doherty Threshold / Flow** — Delays and interruptions affect momentum. Give timely feedback and useful progress states; the site's cited timing threshold is a heuristic, not a universal performance budget. [Source](https://lawsofux.com/doherty-threshold/)
- **Goal-Gradient Effect / Zeigarnik Effect** — Visible progress and unfinished steps can shape motivation and recall. Use progress indicators only when they reflect real progress, and make it clear how to pause or resume.
- **Peak-End Rule** — People may remember especially salient moments and the ending. Inspect the most consequential moment and task completion, not just the average screen.
- **Pareto Principle / Occam's Razor** — These can prompt focus on high-impact causes and simpler explanations. They are broad reasoning heuristics, not a formula for deciding which UX issues affect most users.

## Accessibility is a separate standard

Use the current [W3C WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/) for testable web accessibility requirements. Laws of UX are not accessibility criteria and do not establish WCAG conformance. State the specific criterion and evidence when reporting a conformance issue.

## Sources and currency

- [Laws of UX — collection](https://lawsofux.com/laws/)
- [Laws of UX — book](https://lawsofux.com/book/)
- [W3C — WCAG 2.2](https://www.w3.org/TR/WCAG22/)

The live Laws of UX pages may change. Revisit the relevant source when a task depends on exact wording, a disputed claim, or the latest site content; otherwise keep these paraphrased notes as quick guidance.
