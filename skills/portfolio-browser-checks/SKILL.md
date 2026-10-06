---
name: portfolio-browser-checks
description: Verify portfolio changes in a browser, especially responsive layouts, animation continuity, keyboard interactions and visual regressions.
---

# Portfolio browser checks

Use [DESIGN's browser checklist](../../DESIGN.md#browser-verification) to select checks for the changed behavior. This guide covers verification, not permission to change unrelated features or deploy the site.

## Establish a useful baseline

Inspect the existing diff and identify shared consumers of the changed component. Reproduce a reported bug before changing it when possible. Use the project's dev server for iteration, or build and preview when checking production output. A successful build alone says nothing about visual behavior.

Use available browser tools; no particular browser automation package is required. Do not assume scripts in `.preview.local/` exist on another checkout. Keep new ad hoc scripts, screenshots and browser profiles there, and use a separate test profile rather than personal browser data. Start helpers without visible windows unless the user needs to interact with them. Stop only the helper processes you started.

## Choose observations that can catch the failure

- Layout: measure the actual article/control bounds, document overflow and scroll reachability, not just the outer window. Include normal and fullscreen states where relevant.
- Responsive changes: test 320px, 390px and exactly 768px; cross to 820px with a window open. Include a short desktop such as 820x300, not only a wide screenshot.
- Animations: inspect intermediate frames or equal paused timestamps, both directions and reduced motion. Confirm which CSS animation is applied; unrelated idle frames can look like a regression.
- Keyboard: use real key events and inspect active focus. Test Enter, Escape, Tab and Shift+Tab through the affected controls; programmatic clicks alone do not verify keyboard behavior.
- Terminal: exercise native input, completion and help alignment. For Vim, test typing, save/discard and cursor/syntax/gutter synchronization rather than checking only editor visibility.

Wait for project loading to complete before project-dependent tests; separately test the loading state when that is the subject. Capture runtime exceptions and failed requests, then inspect screenshots in both themes for visual changes.

## Report evidence precisely

Run lint/build after code changes and review `git diff --check`. State the viewport/state combinations and interactions actually checked, plus untested limitations. Emulated mobile checks do not prove physical-device keyboard or safe-area behavior. Do not call a smoke test an exhaustive audit.
