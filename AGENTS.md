# Agent guide

This repository is Benjamin Miller's portfolio: a React 19 single-page app built with Vite. The desktop-like UI has draggable windows, project folders, a terminal, resume viewers, and light/dark themes. The app lives in `app/`; the repository root contains documentation.

## Start here

- Read `README.md` for product context and `DESIGN.md` for architecture and maintenance notes. Check the current source when documentation and implementation differ.
- Run app commands from `app/`: `npm ci` to install, `npm run dev` for local development, `npm run lint` for ESLint, and `npm run build` for a production build. `npm run preview` serves the built output.
- `app/package-lock.json` is committed. Keep it in sync when dependencies change. There is currently no automated test script.

## Where changes belong

- `app/src/App.jsx`: page composition, project fetching and loading states, open-window state, focus order, fullscreen, theme, and the choice of primary project IDs.
- `app/src/components/Window.jsx`: shared window chrome, pointer dragging, controls, and dialog focus behavior. `app/src/constants/windowLayout.js`: viewport breakpoints and window positioning.
- `app/src/data/windowRegistry.jsx`: static desktop windows, external links, and resume links. `app/src/windows/`: window content and the terminal. `app/src/components/ProjectIcon.jsx`: project-specific SVG icons.
- `app/src/assets/styles.css`: all app styles, including mobile, dark mode, focus, and reduced-motion rules. Check later rules in this file before changing a selector because several sections override earlier ones.
- `app/public/projects.json`: project content. Image names in each project's `photos` array refer to files in `app/public/project_photos/`. Public assets are referenced from the site root, such as `/projects.json` or `/resumes/...`.

## Change guidance

- Preserve the desktop window behavior across desktop and mobile: opening, focus/stacking, dragging, fullscreen, close/back, and Escape. The mobile breakpoint is defined in `windowLayout.js` and also used in CSS; keep them aligned if it changes.
- Keep desktop controls keyboard accessible. Preserve dialog labels, focus restoration, visible focus styles, and reduced-motion behavior when editing interactions or styles.
- For a new static window, add a focused module in `src/windows/` and register it in `src/data/windowRegistry.jsx`. For a new project, update `public/projects.json`, add any referenced photos, and consider whether it needs a custom icon in `ProjectIcon.jsx`. `App.jsx` selects primary folders by `MAIN_PROJECT_IDS`; other projects appear in More Projects.
- Keep content edits separate from behavior changes where practical. Avoid broad formatting or CSS rewrites for a focused task. Update `README.md` or `DESIGN.md` when setup steps or architecture change.

## Before finishing

- Run `npm run lint` and `npm run build` from `app/` for code changes. For content-only changes, verify JSON parses and referenced assets exist. Report any check that could not be run.
- For UI changes, check a desktop and narrow viewport, light and dark themes, and the interaction affected by the change. For window changes, include keyboard navigation and fullscreen in the check.
- Review `git diff` and leave generated `app/dist/`, `node_modules/`, and local environment files out of commits.
