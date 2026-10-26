# Audit an existing page

Start with the page the user named. Trace its route to the component and styles that render it. Read nearby pages and shared components to learn the design system before suggesting replacements.

## Review

- **Purpose and hierarchy:** Does the page make its primary task and next action clear? Are headings, navigation, content, and actions ordered sensibly?
- **Responsive behavior:** Check narrow and wide layouts, wrapping, touch targets, overflow, and whether dense sections remain usable. Distinguish source-level risks from behavior confirmed in a browser.
- **Accessibility:** Check semantic landmarks and headings, accessible names for controls, labels and errors on forms, visible focus, keyboard operation, contrast evidence, and reduced-motion behavior where relevant. Use a proven accessible primitive for complex menus, dialogs, comboboxes, and date pickers rather than recreating their keyboard and focus logic.
- **States and feedback:** Look for loading, empty, error, disabled, success, and destructive-action states where the page needs them.
- **Performance and maintenance:** Look for unnecessary client-side JavaScript, duplicate dependencies, oversized assets, animation cost, and a component that conflicts with existing conventions. Do not claim measured performance without a measurement.

## Report

Prioritize a short list of issues. For each, give severity, page or source location, observable evidence, user impact, and a practical fix. Mark anything that needs browser or assistive-technology verification as unverified. Suggest a free component only when it directly addresses an issue; include framework fit and verified cost/license evidence. Do not rewrite the page or modify files unless requested.
