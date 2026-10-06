---
name: portfolio-content
description: Add or update this portfolio's projects, static documents, links, galleries or SVG icon illustrations and their interaction states.
---

# Portfolio content and icons

Start with [README's maintenance guide](../../README.md#maintain-content), [DESIGN's project schema](../../DESIGN.md#project-data) and, for illustration changes, [the visual requirements](../../DESIGN.md#motion-and-visual-requirements).

## Follow the content into every consumer

- Project records live in `app/public/projects.json`. Use unique IDs and exact photo filenames. Add corresponding mappings in `app/src/components/ProjectIcon.jsx`; optional gallery captions and project summaries live in `windows/ProjectWindowContent.jsx`.
- Featured placement is selected by `app/src/data/projectLayout.js`, not JSON order. Verify the desktop launchers and terminal root/More Projects directory agree after regrouping.
- Static documents require a content module, a `systemWindows` registry entry and a `DesktopIcon.jsx` mapping. Resume/social URLs come from `data/windowRegistry.jsx`. Terminal About/README/Experience text has separate static copies; update relevant copies with content changes.
- The on-site README is `app/src/windows/readmeWindow.jsx`; it does not render root `README.md`. Root docs and `skills/` are contributor guidance, not site content.

## Preserve illustration and gallery behavior

Choose the existing SVG component and its stylesheet rather than replacing an illustration with a raster asset. Every SVG gradient ID must be unique per instance. Compare launcher and detail copies: only launchers gain stronger hover/focus motion; detail icons retain idle motion without header-hover or link-focus reactions. Documents have no looping idle motion and the terminal cursor is steady. The More Projects folder is static at rest with reversible opening/reveal motion.

Follow the icon-specific geometry and theme requirements in DESIGN. Check changed icons at natural size and 4-8x enlargement, in both themes, through idle, hover entry, intermediate frames, full hover, exit and keyboard focus. Compare equal animation timestamps and test reduced motion.

Project detail section order is About, Technologies used, then Photo Gallery. Preserve original-image links, restrained mastheads and fullscreen article width. Gallery layout ignores legacy `imageSize` values; change `assets/project-details.css` instead.

## Verify content and assets

Parse edited JSON and check local photo/PDF paths and filename case. In the browser, inspect changed project pages, missing-image fallback when relevant, and bottom scrolling in normal/fullscreen/short-height windows. Check mobile single-column galleries and that local assets return image/PDF data rather than fallback HTML.

Run lint/build for code changes. For documentation-only work, validate links and consistency instead of claiming a new visual audit. Keep README, DESIGN, AGENTS and relevant skills aligned without copying full command references into every file.
