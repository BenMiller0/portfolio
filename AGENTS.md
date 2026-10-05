# Agent guide

This repository is Benjamin Miller's React 19/Vite portfolio: draggable windows, SVG project icons, a simulated terminal, galleries, resume viewers and light/dark themes. Work in `app/`; root Markdown files document the project.

## Start here

- Read [README.md](README.md) for setup and [DESIGN.md](DESIGN.md) for architecture, visual requirements and browser verification. Check the source when docs differ; user instructions are the design authority.
- Use the npm lockfile. Vite 7 requires Node 20.19+ on the 20.x line or 22.12+. From `app/`, use `npm ci`, `npm run dev`, `npm run lint`, `npm run build` and `npm run preview`.
- In PowerShell, use `npm.cmd` if execution policy blocks `npm`. If the default Vite config bundler fails under restricted filesystem access, use `-- --configLoader runner` for dev/build.
- Inspect the existing diff first. Preserve unrelated and unfinished user changes. There is no `npm test` script or committed automated browser suite.

## Where changes belong

- `app/src/App.jsx`: desktop composition, project loading/status, window state, stacking, fullscreen, theme and `MAIN_PROJECT_IDS`.
- `app/src/components/Window.jsx`: chrome, dragging, viewport clamping and focus. `constants/windowLayout.js`: placement estimates and breakpoint. `hooks/useMobileViewport.js`: reactive breakpoint subscription.
- `app/src/components/DesktopIcon.jsx`: documents, socials, terminal and More Projects. `ProjectIcon.jsx`: ID mapping. `FeaturedProjectIcons.jsx` and `SupportingProjectIcons.jsx`: project SVGs.
- `app/src/assets/styles.css`: shared layout, windows, terminal, resumes and mobile rules. Separate files cover desktop icons, featured icons, supporting icons and project details. Inspect later overrides and computed styles before adding rules.
- `app/src/data/windowRegistry.jsx`: static windows and link metadata. `app/src/windows/`: page content, gallery summaries/captions and terminal implementation.
- `app/public/projects.json`: project records. Photos are in `public/project_photos/`, PDFs in `public/resumes/`, and raster icons in `public/icons/`. Public URLs start at `/`.

## Preserve the interaction design

- Project launchers retain dynamic idle motion and stronger hover/focus reactions. Detail icons retain idle motion but must not react to hovering the icon/header or focusing links.
- More Projects is a static normal folder at rest with smooth opening/card reveal on hover or keyboard focus and smooth closing on exit. No exposed back-panel corners or doubled folder edges.
- Documents have no looping idle animation. The terminal icon cursor does not blink. Keep GitHub's green status dot and LinkedIn's top highlight absent.
- The bird shows both eyes and looks around. Vader has clearly switching LEDs referenced from the suit photo and audio waves on both sides. The wand glow stays attached to its tip. Every icon has explicit dark-mode styling.
- Respect reduced motion. SVG gradient IDs must be unique per instance.
- Project sections are **About**, **Technologies used**, then **Photo Gallery**. Preserve the restrained masthead/divider layout and original-image links without visible "View full size" overlays.
- Fullscreen project articles fill the available width. Check the article itself for gutters, and scroll to the bottom in normal, fullscreen and short-height windows.

## Change guidance

- Preserve open, stack, drag, fullscreen/restore, Back, Close and Escape behavior. Mobile is **768px inclusive**; keep CSS and JS aligned. Keep desktop name/school branding centered; use spacing to avoid icon overlap. Only very short desktop viewports need a centered header above scrollable icons. Keep the theme toggle in the bottom-right corner and clear of the mobile dock.
- Preserve visible keyboard focus, dialog labels, focus restoration and modal Tab containment. Respect child handlers that prevent Tab's default. Test terminal completion and Shift+Tab when changing focus behavior.
- Add static modules and registry entries together with icon mappings. Add projects with unique IDs, valid optional fields and matching photo filenames. `MAIN_PROJECT_IDS` selects featured projects; array order does not.
- The gallery ignores legacy `imageSize` values; use `project-details.css` for layout changes.
- Avoid broad CSS rewrites for focused fixes. Remove obsolete rules belonging to the change and preserve unrelated work.
- Update all affected root docs when setup, architecture, behavior or maintenance instructions change. The on-site README is a separate React module.

## Audit and verification before finishing

Proactively inspect adjacent states and shared components. Do not wait for the user to identify another example of the same defect. Reproduce observed issues, fix the cause and verify in a browser. Lint/build success alone is not a visual audit.

- Inspect changed icons at natural size and 4-8x enlargement in both themes. Check idle, hover entry, intermediate frames, full hover, exit and keyboard focus. Look at silhouettes, overlapping surfaces, attachment points and clipping.
- Test launchers and detail-page icon copies separately. Header hover and link focus must not trigger launcher motion.
- Inspect desktop, compact desktop, short-height and 320/390px mobile layouts. Check branding/label overlap, overflow, visible controls and 768px transitions.
- For shared window changes, test all seven projects, fullscreen width/bottom scrolling, restore, drag bounds, keyboard stacking, Escape, More Projects -> child -> Back -> Close, and terminal input.
- Follow [DESIGN.md's checklist](DESIGN.md#browser-verification) for relevant failures and assets. Compare animation configurations or equal timestamps instead of unrelated live frames.
- Run lint and build after code changes. For content-only edits, validate JSON, local links and assets. Review every root Markdown file when asked for a documentation audit, including this guide.
- Review `git diff --check` and the final diff. Keep `app/dist/`, dependencies and local screenshot/test artifacts out of commits. Report actual verification, untested limitations and unresolved issues without claiming exhaustive bug freedom.
