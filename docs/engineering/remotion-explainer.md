## What it does

`remotion-explainer` builds explanatory animations with [Remotion](https://www.remotion.dev): React components that render to video, written in TypeScript, with narration synced frame-by-frame. It takes a topic and produces a staged deliverable: a design system, a pilot (one revised example scene), variations, and a final render ready to hand to DaVinci Resolve.

The defining constraint: a working `pilot` composition validates the design system and timing before anything scales. Ask the question in one scene, fix it against real rendering and real audio, then replicate the pattern across the remaining scenes. Videos fail at the edit and the sync, so the cheapest place to find out is one scene long.

## When to reach for it

Type `/remotion-explainer`, or the agent reaches for it automatically when a task calls for an explainer, walkthrough, or teaching animation rather than a plain video edit.

| Your situation | Reach for |
| --- | --- |
| An explainer animation that teaches one idea in steps | `remotion-explainer` |
| Straight video editing with no React or narration | A video editor, not this skill |
| Handing the timeline to a colorist or editor afterward | `remotion-explainer`, which renders an intermediate ProRes/XML handoff |

## Prerequisites

Node 16+ and a project the init script can scaffold (`npx create-video` underneath). Narration sync works best from a transcript, which the skill generates with a local Whisper CLI when available and asks for a timing map when not.

## The pilot is the pitch

The skill's leading word is the **pilot**: one scene, rendered fully, before building the rest. The loop it runs is:

1. Write a design system (tokens, springs, timing, shared components) into the project.
2. Build and render the pilot scene; audit it as stills, not just a preview in the browser.
3. Sync narration through an `AudioSyncMap`: script lines mapped to frames, verified against real audio duration.
4. Only then produce variations (different framings of the same idea) and the final render.

Professionals this discipline borrows from are costs it avoids: re-rendering everything after a timing change, and discovering a spring feels wrong eleven scenes deep.

## Common questions

**Why not use a video template or After Effects?**

When the animation is data-driven (code, charts, branching explanations), React already knows how to lay out text and interpolate values, and the source becomes reviewable code. For effects-heavy filmmaking, a motion tool is still the right answer.

**How does the narration stay in sync?**

A transcript defines line-by-line timings, an `AudioSyncMap` maps each line to the frame it must land on, and the composition positions scenes from that map rather than hand-tuned offsets. Re-recording narration changes the map, not ten compositions.

**Can I hand the result to DaVinci Resolve?**

Yes: render profiles cover a highest-quality intermediate (including ProRes and alpha-capable pixel formats such as `yuva444p10le`) and an XML handoff, so the edit surfaces in Resolve rather than being re-encoded.

## It's working if

- The pilot renders end to end and survives a still audit before more scenes exist.
- Changing one narration line moves the timing in one file, not in every scene.
- The final render plays in Resolve with no visible re-compression or color shift.

## Where it fits

This is a standalone creation skill, not a step in a chain: it scaffolds its own Remotion workspace and runs to a rendered deliverable. [code-review](https://aihero.dev/skills-code-review) can review the React output against repository standards once written. [ask-matt](https://aihero.dev/skills-ask-matt) routes across the full skill set.
