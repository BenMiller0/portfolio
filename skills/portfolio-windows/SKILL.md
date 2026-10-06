---
name: portfolio-windows
description: Change this portfolio's responsive desktop layout, window lifecycle, focus, dragging or More Projects handoffs.
---

# Portfolio windows

Read [DESIGN's window lifecycle](../../DESIGN.md#window-lifecycle) and [browser checklist](../../DESIGN.md#browser-verification) for the affected states. Paths below are relative to `app/src/`.

## Trace the state before changing layout

`App.jsx` owns open windows, z-order, fullscreen state and replacement relationships. `components/Window.jsx` owns chrome, drag bounds, focus and entry completion. Breakpoint logic lives in `constants/windowLayout.js` and `hooks/useMobileViewport.js`; CSS must agree that 768px is mobile. Inspect later overrides in `assets/styles.css` and browser computed styles before adding a rule.

For More Projects on mobile, retain the outgoing window behind its replacement until entry completion. The outgoing window must be inert and hidden from assistive technology. Preserve the completion guard and fallback timer for disabled/interrupted animation. Test both folder-to-project and Back; a fix for only one direction is incomplete. Do not extend the mobile handoff animation to desktop unless asked.

Opening an existing window should focus it. Closing must restore a connected launcher without stealing focus from an incoming child. Back preserves fullscreen state. Window Tab containment must respect child `defaultPrevented`, especially terminal completion and Vim insertion; Vim contains Escape while active.

## Inspect adjacent states

- Reproduce the reported viewport/state first, then test the same interaction on both sides of 768px, including resizing an open window across the breakpoint.
- For shared window changes, use all current projects: open, fullscreen, scroll to the last content, restore, drag to edges, focus by keyboard, Escape and Close. Exercise More Projects -> child -> Back -> Close with and without reduced motion.
- Sample intermediate transition frames; do not infer continuity from final screenshots. Keep background coverage throughout a handoff and avoid restarting the entry animation on completion.
- For desktop layout changes, check centered branding and icon overlap at 1440x900, 1024x600, 820x600 and 820x300. For mobile, inspect 320px, 390px and 768px, both themes and overflow.
- The theme toggle remains bottom-right above the full-width mobile dock, with safe-area spacing. The mobile light-mode background is intentionally darker than the earlier version; preserve desktop and dark-mode styling for mobile-only requests.

Run lint/build and report the browser states actually inspected. Store local browser artifacts in `.preview.local/`; update DESIGN when interaction rules change.
