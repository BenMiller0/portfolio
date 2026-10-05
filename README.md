# Benjamin Miller Portfolio

[Visit the portfolio](https://benjaminmillerportfolio.onrender.com/).

A React 19 and Vite portfolio with a desktop interface: illustrated project icons, draggable windows, an interactive terminal, photo galleries, resume viewers, and persistent light/dark themes. The application lives in `app/`.

See [DESIGN.md](DESIGN.md) for implementation details and browser verification, and [AGENTS.md](AGENTS.md) for contributor guidance.

## Run locally

Use Node.js 22.12+ (or Node 20.19+ on the 20.x line), matching the installed Vite 7 engine requirement. Use npm with the committed lockfile.

```sh
cd app
npm ci
npm run dev
```

Vite prints the local URL. In Windows PowerShell, use `npm.cmd` if execution policy blocks the npm PowerShell shim.

```sh
npm run lint
npm run build
npm run preview
```

Production output is `app/dist/`. Preview serves that output locally; it does not deploy the site. If a restricted environment prevents Vite's default config bundler from accessing its temporary files, use `npm run dev -- --configLoader runner` or `npm run build -- --configLoader runner`.

## Interface behavior

- Desktop windows support dragging, stacking, fullscreen, restore, and Escape to close the front window. Opening an existing window focuses it.
- At widths of 768px or less, windows fill the viewport and dragging is disabled. Desktop branding stays centered, with spacing below the icon rows on smaller screens. Very short desktops use a centered header and a scrollable icon area.
- Project pages show **About**, **Technologies used**, then **Photo Gallery** when photos exist. Fullscreen content spans the available window width and scrolls to the last photo.
- Project launchers have continuous idle animation and stronger hover/keyboard-focus reactions. Icons inside project pages retain idle motion without those hover reactions.
- More Projects is a static folder at rest; hovering or keyboard-focusing it opens the folder and reveals project cards. Document and terminal icons have no looping idle animation.
- Icon families have explicit dark-mode materials. Reduced-motion preferences disable animated icon movement.
- The terminal supports file browsing, project information, command history and Tab completion. Shift+Tab moves focus back to the window controls.
- Project loading has loading, empty and retry states. Missing photos display a fallback. Resume windows include a PDF viewer and download link.

## Source map

| Location | Purpose |
| --- | --- |
| `app/src/App.jsx` | Desktop composition, project loading, window lifecycle, theme |
| `app/src/components/Window.jsx` | Window chrome, dragging, focus and controls |
| `app/src/components/DesktopIcon.jsx` | Documents, social icons, terminal, More Projects folder |
| `app/src/components/ProjectIcon.jsx` | Project ID to SVG icon mapping |
| `app/src/components/FeaturedProjectIcons.jsx` | Bird, Vader and wand illustrations |
| `app/src/components/SupportingProjectIcons.jsx` | Verification, chart, calendar and compressor illustrations |
| `app/src/assets/` | Shared styles and separate icon/project-detail stylesheets |
| `app/src/constants/windowLayout.js` | Mobile breakpoint and placement estimates |
| `app/src/hooks/` | Typewriter animation and reactive mobile viewport detection |
| `app/src/data/windowRegistry.jsx` | Static windows, social links and resume paths |
| `app/src/windows/` | Project details, terminal, About, README and experience |
| `app/public/projects.json` | Project records |
| `app/public/project_photos/` | Gallery originals |
| `app/public/resumes/` | Hardware and software resume PDFs |
| `app/public/icons/` | Supporting raster assets and favicon |

## Maintain content

### Projects

1. Add a record with a unique `id`, `label` and `title` to `app/public/projects.json`. See [the project schema](DESIGN.md#project-data).
2. Add gallery originals to `app/public/project_photos/` and list their exact filenames in `photos`.
3. Add an illustration to `ProjectIcon.jsx`. Add optional summaries and photo captions in `ProjectWindowContent.jsx`.
4. Update `MAIN_PROJECT_IDS` in `App.jsx` only when changing the featured projects. The current featured IDs are `project1`, `project3` and `project4`; all others appear in More Projects.

Legacy `imageSize` values still present in the JSON are unused by the current gallery. Layout is controlled by `project-details.css`.

### Static windows and links

Create a content module in `app/src/windows/`, export its window config, and register it in `systemWindows` in `windowRegistry.jsx`. Add a corresponding visual in `DesktopIcon.jsx`; registering a new ID alone does not create an icon.

Update `socialLinks` or `resumeLinks` in the same registry for links and PDFs. Resume URLs are `/resumes/Resume_Benjamin_Miller.pdf` and `/resumes/Resume-Benjamin-Miller.pdf`. Keep terminal file links consistent when changing them.

## Verification and hosting

Run lint and build after code changes, then follow the [browser checklist](DESIGN.md#browser-verification). There is no committed automated browser suite or `npm test` script. A successful build does not verify appearance, scrolling, animation or keyboard behavior.

For static hosting with the repository root as the build root, use `cd app && npm ci && npm run build` and publish `app/dist`. With `app/` as the configured root, use `npm ci && npm run build` and publish `dist`. Vite's base and asset URLs assume deployment at `/`.

`app/public/_redirects` contains an SPA fallback. Configure the equivalent rewrite on hosts that do not read that file. Verify images and PDFs return their actual file types rather than fallback HTML.
