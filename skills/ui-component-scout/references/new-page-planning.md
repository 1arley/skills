# Plan a new page

First identify the page's audience, main task, content, important actions, and any constraints the user gave. Inspect the repository and reuse its framework, design tokens, routing, and installed components. If there is no project yet, choose technology only from stated needs such as rendering, interactivity, deployment, and team familiarity; ask only when a missing constraint would materially change the recommendation.

## Keep the page fast and maintainable

- Prefer semantic HTML and the project's existing styling system. Tailkits specializes in Tailwind; do not introduce Tailwind into a project that uses another styling approach just to copy a snippet.
- Keep mostly static content static or server-rendered when the framework supports it. Add client-side JavaScript only for interactions that need it.
- For simple presentation, adapt a small copy-paste section if its license allows it. For complex interactive behavior, prefer a maintained, accessible primitive compatible with the framework. Avoid pulling in an entire design system for one small block.
- Reuse existing components and tokens. Avoid a visual patchwork of unrelated blocks; explain when a candidate needs restyling to fit.

## Deliver

For research or planning requests, provide a compact page outline and a small set of suitable component candidates. Link each candidate to its official source and state the framework/version fit, free-use evidence, license, and integration cost or caveat. For implementation requests, build only the requested page scope and follow the repository's conventions; do not silently migrate its stack or add unrelated features.
