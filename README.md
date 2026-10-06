# Benjamin Miller Portfolio

[Visit the portfolio](https://benjaminmillerportfolio.onrender.com/).

A React 19 and Vite portfolio with a desktop interface: illustrated project icons, draggable windows, an interactive terminal, photo galleries, resume viewers, and persistent light/dark themes. The application lives in `app/`.

See [DESIGN.md](DESIGN.md) for implementation details and browser verification, and [AGENTS.md](AGENTS.md) for contributor guidance.

Repository-local agent skills live under `skills/`; [the skills index in AGENTS.md](AGENTS.md#repository-skills) covers terminal/Vim, windows/layout, content/icons, browser checks, documentation and asset/loading diagnostics. They are Markdown instructions for agents, not an in-app Skills tab or installed plugin.

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

The repository may also contain a local `.preview.local/` workspace with browser-audit scripts, screenshots and a temporary Chrome profile. It is disposable, ignored by Git and unrelated to the `npm run preview` server. Generated dependencies and production output (`app/node_modules/` and `app/dist/`) are ignored as well.

## Interface behavior

- Desktop windows support dragging, stacking, fullscreen, restore, and Escape to close the front window. Opening an existing window focuses it.
- At widths of 768px or less, windows fill the viewport and dragging is disabled. Desktop branding stays centered, with spacing below the icon rows on smaller screens. Very short desktops use a centered header and a scrollable icon area.
- Project pages show **About**, **Technologies used**, then **Photo Gallery** when photos exist. Fullscreen content spans the available window width and scrolls to the last photo.
- Project launchers have continuous idle animation and stronger hover/keyboard-focus reactions. Icons inside project pages retain idle motion without those hover reactions.
- More Projects is a static folder at rest; hovering or keyboard-focusing it opens the folder and reveals project cards. Document and terminal icons have no looping idle animation.
- The theme toggle stays in the bottom-right corner, above the full-width dock on mobile. Icon families have explicit dark-mode materials. Reduced-motion preferences disable animated icon movement.
- The terminal supports file browsing, command history, Tab completion and a custom Vim-style editor. Shift+Tab leaves the input/editor; Escape inside Vim returns to Normal mode without closing Terminal.
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
| `app/src/data/projectLayout.js` | Shared featured/More Projects grouping for the desktop and terminal |
| `app/src/hooks/` | Typewriter animation and reactive mobile viewport detection |
| `app/src/data/windowRegistry.jsx` | Static windows, social links and resume paths |
| `app/src/windows/` | Project details, terminal, About, README and experience |
| `app/src/windows/vimSession.js` | Custom modal editing engine, buffers, registers, macros and editor commands |
| `app/src/components/VimEditor.jsx`, `vimHighlight.jsx` | Editor input, classic terminal rendering and syntax colors |
| `app/public/projects.json` | Project records |
| `app/public/project_photos/` | Gallery originals |
| `app/public/resumes/` | Hardware and software resume PDFs |
| `app/public/icons/` | Supporting raster assets and favicon |

## Maintain content

### Projects

1. Add a record with a unique `id`, `label` and `title` to `app/public/projects.json`. See [the project schema](DESIGN.md#project-data).
2. Add gallery originals to `app/public/project_photos/` and list their exact filenames in `photos`.
3. Add an illustration to `ProjectIcon.jsx`. Add optional summaries and photo captions in `ProjectWindowContent.jsx`.
4. Update `MAIN_PROJECT_IDS` in `app/src/data/projectLayout.js` only when changing the featured projects. The current featured IDs are `project1`, `project3` and `project4`; all others appear in More Projects on both the desktop and in the terminal.

Legacy `imageSize` values still present in the JSON are unused by the current gallery. Layout is controlled by `project-details.css`.

### Static windows and links

Create a content module in `app/src/windows/`, export its window config, and register it in `systemWindows` in `windowRegistry.jsx`. Add a corresponding visual in `DesktopIcon.jsx`; registering a new ID alone does not create an icon.

Update `socialLinks` or `resumeLinks` in the same registry for links and PDFs. Resume URLs are `/resumes/Resume_Benjamin_Miller.pdf` and `/resumes/Resume-Benjamin-Miller.pdf`. The terminal uses those same link records and the registered document filenames.

### Terminal folders

The virtual home directory (`~`, also accessible as `/`) mirrors the desktop: `about_me.txt`, `README.txt`, `experience.txt`, social links, resume PDFs, and the three featured `.proj` files. The other four projects live in `~/More Projects/`. Project filenames use underscores in place of punctuation/spaces; resume filenames use underscores in place of spaces.

Use `cd "More Projects"` and `ls` to browse that folder, `cat *.proj` to read its projects, and `cd ..` to return. Tab completes directory and file paths, including paths containing spaces. This is an in-memory portfolio explorer, not access to the website's source files or your computer.

Commands: `help`, `ls [path]` (no options), `cd`, `pwd`, `cat`, `vim`, `open`, `whoami`, `echo`, `clear`, `date`, `grep`, `wc` and `man`. `head`, `tail`, `resume`, `projects` and `about` are not commands. `whoami` prints “Benjamin Miller — embedded systems, software, and ML engineering.”

`help` displays only the command list, with descriptions aligned to a shared column. Detailed command instructions remain in `man <command>` and Vim's `:help`; no navigation or editing tutorial is appended to shell help.

### Custom Vim editor

Run `vim README.txt`, `vim "More Projects/notes.txt"`, or `vim` for an unnamed buffer. Press `i` to insert, Escape for Normal mode, then `:wq` and Enter to save and quit. `:q!` discards unwritten changes. `:help` (or `man vim` in the shell) lists the implemented commands.

The editor implements Insert/Replace/Visual modes, counted motions and operators, text objects, registers, macros, marks, undo/redo, dot repeat, regex search/substitution and multiple buffers. Its classic black terminal surface has line numbers, cyan `~` filler lines, a block cursor and basic syntax colors for common code extensions. Mobile adds compact touch keys below the command line.

Writes affect only the virtual filesystem for the lifetime of the open Terminal window; closing Terminal or reloading resets them. Existing directories must be used, PDFs cannot be edited, and portfolio pages/source files are not changed. This is an original browser implementation, not upstream Vim: Vimscript, plugins, external commands, split windows and visual-block mode are not implemented. Search patterns use JavaScript regular expressions rather than Vim's regex dialect.

## Verification and hosting

Run lint and build after code changes, then follow the [browser checklist](DESIGN.md#browser-verification). There is no committed automated browser suite or `npm test` script. A successful build does not verify appearance, scrolling, animation or keyboard behavior. Keep temporary browser profiles, audit scripts and screenshots in `.preview.local/` so they remain outside version control.

For static hosting with the repository root as the build root, use `cd app && npm ci && npm run build` and publish `app/dist`. With `app/` as the configured root, use `npm ci && npm run build` and publish `dist`. Vite's base and asset URLs assume deployment at `/`.

`app/public/_redirects` contains an SPA fallback. Configure the equivalent rewrite on hosts that do not read that file. Verify images and PDFs return their actual file types rather than fallback HTML.
