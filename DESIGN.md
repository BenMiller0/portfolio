# Portfolio design and maintenance

This document describes the current React/Vite application. See [README.md](README.md) for setup and hosting commands and [AGENTS.md](AGENTS.md) for contribution requirements.

Task-specific agent workflows live in `skills/<name>/SKILL.md`, indexed in [AGENTS.md](AGENTS.md#repository-skills). Keep architectural facts here and focused implementation/verification guidance in the relevant skill. The skills directory is documentation only; it is not bundled into the site.

## Architecture

Paths below are relative to `app/src/`.

| Module | Responsibility |
| --- | --- |
| `App.jsx` | Fetch projects, compose desktop icons, manage windows and theme |
| `components/Window.jsx` | Dialog shell, controls, pointer dragging/resizing, focus restoration and containment |
| `hooks/useWindowResize.js` | Local resize previews, pointer lifecycle, viewport limits and keyboard resizing |
| `constants/windowLayout.js` | `MOBILE_BREAKPOINT`, initial placement and restore-position estimates |
| `hooks/useMobileViewport.js` | Subscribe to the breakpoint with `matchMedia` and `useSyncExternalStore` |
| `hooks/useTypewriter.js` | Intro text and reduced-motion behavior |
| `data/windowRegistry.jsx` | `systemWindows`, `getTerminalDesktopWindow(projects)`, `socialLinks`, `resumeLinks` |
| `data/projectLayout.js` | Shared `MAIN_PROJECT_IDS`, `MORE_PROJECTS_DIRECTORY` and `getProjectGroups(projects)` for desktop/terminal placement |
| `data/projectLinks.js` | Resolve initial project links from a slug/ID path or a root `?project=` query |
| `windows/ProjectWindowContent.jsx` | Masthead, descriptions, technologies, gallery and failed-image fallback |
| `windows/TerminalWindow.jsx` | In-memory file explorer, commands, completion and history |
| `windows/vimSession.js` | Browser-native modal editing state and virtual-file adapter interface |
| `components/VimEditor.jsx`, `components/vimHighlight.jsx` | Editor keyboard/touch input, cursor and syntax rendering |
| `windows/readmeWindow.jsx`, `experienceWindow.jsx`, `leadershipWindow.jsx` | Static window content; README includes the biography and skills |
| `data/experience.js`, `components/ExperienceList.jsx` | Shared work/leadership records, terminal formatting and window list rendering |

The on-site README window is a React content module; it does not render the repository's `README.md`.

### Project loading

`App.jsx` fetches `/projects.json`, checks for a list, and filters records for string `id`, `label` and `title` fields. This is basic validation, not a complete schema validator. Authors must validate optional fields and ensure IDs are unique.

Loading placeholders become project buttons after success. Empty data and failed requests have separate states; the error button retries the fetch. `MAIN_PROJECT_IDS` selects `project1`, `project3` and `project4` in that order. JSON array order does not choose the featured projects. Remaining records populate More Projects.

### Window lifecycle

After project loading succeeds, `App.jsx` resolves the current URL once through `findLinkedProject` and opens a matching project with `isFullscreen: false`. A ref guards against duplicate opens and reopening after Close, theme changes or resizing; failed loads can still open the linked project after Retry. Slugs are explicit project data, independent of titles. Matching accepts project IDs, case differences, underscore separators and trailing slashes. Unknown or malformed paths leave the desktop usable. Root `?project=<slug-or-id>` links provide a fallback for hosts without a path rewrite. This is initial-window selection, not browser-history routing; window interactions leave the URL unchanged.

Direct links to More Projects children have the usual Back behavior, including fullscreen preservation and mobile handoffs. Closing a linked window restores focus to its desktop launcher (the folder for More Projects children).

`openWindows` stores IDs, titles, content elements, positions, optional user-chosen sizes, z-indices, fullscreen flags, optional Back callbacks, header colors and focus-return targets. Opening an existing ID raises and focuses its window. Pointer interaction and keyboard focus entering a window raise it. Escape closes the window with the highest state z-index.

`Window.jsx` uses pointer capture while dragging. Placement helpers supply initial estimates; a layout effect and `ResizeObserver` clamp restored windows using actual dimensions. Restore calculates a fresh position rather than remembering the pre-fullscreen drag position.

Above 768px, normal windows resize from eight edge/corner handles. `useWindowResize` previews bounds locally at most once per animation frame, avoiding rerendering the desktop on every pointer move, then commits position and size together when the gesture finishes. The opposite edge stays fixed, bounds retain an 8px viewport margin, and minimum dimensions are 360×220px (or the smaller starting dimension for initially compact windows). Pointer capture, cancellation, lost capture, blur, viewport changes and unmount clean up the gesture; PDF iframes cannot intercept the pointer while resizing. The bottom-right grip supports arrow keys in 10px steps, or 40px with Shift.

Custom sizes survive fullscreen/restore and mobile/desktop transitions until the window closes; they are not persisted across reloads or transferred to replacement windows. CSS caps them to a smaller desktop viewport, including below the usual minimum dimensions when necessary. Mobile and fullscreen omit resize handles and ignore custom dimensions. Resized desktop windows disable the opening animation during and after resizing, so releasing or repeating a gesture does not replay it. Their content fills the new bounds; the `resizable-window` container query adapts project mastheads and galleries at window widths of 600px or less without changing the 768px mobile breakpoint. Terminal and Vim surfaces use the available resized height.

More Projects opens a child and closes the folder window. On mobile, the inert outgoing window remains visually behind the incoming window until its entrance animation finishes, preventing a flash of the desktop in both the project and Back handoffs. Back reopens More Projects using the child's current fullscreen state. The desktop folder button remains the focus-return target, avoiding attempts to focus detached controls.

At 768px and below, every window uses the viewport layout and modal focus behavior regardless of its explicit fullscreen flag. Crossing the breakpoint updates dragging, focus containment and background scroll locking. Resume viewers initially open fullscreen.

### Focus and scrolling

- Dialogs and controls have labels. Opening focuses the window unless a child, such as the terminal input, already received focus.
- Closing restores focus to a connected launcher when focus belonged to the closing window. It must not steal focus from a newly opened child.
- Fullscreen and mobile windows wrap Tab/Shift+Tab among visible controls. Hidden fullscreen buttons must not enter the mobile tab order.
- The window respects `defaultPrevented` from child handlers. Terminal Tab completion stays in the input; Shift+Tab leaves it.
- Window shells use a flex column with a fixed title bar and shrinking, scrollable content. `min-height: 0` prevents clipping in short viewports.
- Fullscreen project articles have no width cap or centered outer margin. Keep paragraph reading measure without reintroducing blank gutters around the page.

Keyboard operation is supported, but the site has not been certified against an accessibility standard. Keyboard window movement and automated accessibility checks remain possible improvements.

## Styling and illustrations

| Stylesheet in `app/src/assets/` | Scope |
| --- | --- |
| `styles.css` | Desktop, branding, shared windows, terminal, resumes, mobile layout |
| `desktop-icons.css` | Documents, socials, terminal icon and More Projects |
| `featured-project-icons.css` | Bird, Vader and wand materials and motion |
| `supporting-project-icons.css` | Verification, chart, calendar and compressor icons |
| `project-details.css` | Mastheads, sections, photos, themes and responsive details |
| `vim-editor.css` | Classic black Vim surface, line numbers, block cursor, syntax colors and mobile touch keys |

`ProjectIcon.jsx` maps IDs to SVGs from `FeaturedProjectIcons.jsx` and `SupportingProjectIcons.jsx`. `DesktopIcon.jsx` renders the other illustrations. Gradients use `useId()` because desktop and window copies coexist. Unknown project IDs currently have no illustration; add a mapping when adding a project.

Shared CSS has successive overrides. Inspect all matching rules and computed styles before adding another. CSS controls rendered dimensions; `windowLayout.js` provides positioning estimates.

### Motion and visual requirements

| Context | Expected behavior |
| --- | --- |
| Project launchers, including More Projects children | Continuous idle motion; stronger hover and keyboard-focus reaction |
| Project detail icons | Idle motion only; hovering icon/header or focusing links must not amplify or switch animation |
| More Projects folder | Static closed folder; front opens and three cards fan out on hover/focus; smooth reverse on exit |
| Document icons | No looping idle animation; brief hover/focus response allowed |
| Terminal icon | Steady cursor, no blinking idle animation |
| Reduced-motion preference | No animated icon movement; folder hover/focus state may change immediately |

The bird shows both eyes and looks around. Vader uses the suit photo as its button-color reference, independently blinking LEDs, and audio waves on both sides. The wand glow stays attached to its tip. Every icon family has explicit dark-mode materials. Keep the GitHub status dot and LinkedIn top highlight absent.

The folder has one back tab and one front panel, rounded joins, and no exposed back-panel corners underneath. Inspect all animation stages at enlarged scale as well as normal icon size.

### Responsive layout

Mobile is **768px inclusive** in CSS and JavaScript. It uses a scrollable desktop, a full-width bottom dock for terminal/social links, a bottom-right theme toggle above the dock, and viewport-filling windows with hidden fullscreen controls.

Above that breakpoint, windows remain draggable and the name and school line stay horizontally centered. At up to 1280px wide or up to 800px high, branding sits below the icon rows to avoid overlap. Desktop viewports at most 500px high use a centered header above a scrollable icon area, with space beside the icons for the bottom-right theme control. These layout adjustments are separate from mobile window behavior. Larger desktops keep resumes at the right and the terminal at the lower left.

## Project data

Example record in `app/public/projects.json`:

```json
{
  "id": "project8",
  "slug": "example-project",
  "label": "Short Desktop Label",
  "title": "Full Project Title",
  "description": "First paragraph.\nSecond paragraph.",
  "technologies": "React, Vite, CSS",
  "github": "https://github.com/user/repo",
  "photos": ["example.png"],
  "miscLink": {
    "displayName": "Demo",
    "url": "https://example.com"
  }
}
```

- `id`, `label` and `title` are required strings. Use a unique ID that does not collide with a static window.
- `slug` is an optional unique lowercase hyphenated name for `/<slug>` links. Keep published slugs stable and avoid collisions with other project IDs, slugs or static asset paths. Without a slug, `/<id>` still works.
- `description` is split into paragraphs at newlines. `technologies` is a comma-separated string.
- `photos` is an array of filenames in `app/public/project_photos/`; omit it or use an empty array for no gallery. Filenames are URL-encoded and case must match the assets.
- `github` and `miscLink.url` should be HTTP(S) links. Project-page links are filtered to those protocols and open in a new tab.
- `imageSize` is legacy and unused. Control sizing through CSS.

Pages use solid project-colored mastheads, restrained link buttons, section labels, dividers, plain technologies lists and unframed photos. Section order is **About**, **Technologies used**, **Photo Gallery**; empty sections are omitted. Optional summaries and filename-based captions live in `ProjectWindowContent.jsx`.

Photos preserve aspect ratio and follow the `photos` array order. Galleries use two columns on desktop and one on mobile or inside a resized window at most 600px wide; single-photo galleries always use one column. Links open the originals without a visible "View full size" overlay. A failed image replaces its link with an "Image unavailable" fallback.

## Other content

Add a content component in `app/src/windows/` and export its config:

```jsx
export const contactWindow = {
  id: 'contactWindow',
  title: 'Contact',
  label: 'contact.txt',
  color: '#a78bfa',
  component: ContactContent
};
```

Define `ContactContent`, register the config in `systemWindows`, and add its visual to `DesktopIcon.jsx`. Registry IDs and visual mappings are separate. Work and leadership are separate documents (`experience.txt` and `leadership.txt`), backed by `workExperience` and `leadershipExperience` in `data/experience.js`. Both windows render `ExperienceList`; the terminal formats those same entries with dates and bullets. Leadership order is Star Wars Club, Roblox + RBXDev, then TEA.

Resume/social metadata live in `windowRegistry.jsx`, which passes those records and the registered document labels to the terminal. README combines the biography, skills and portfolio description in `readmeWindow.jsx`, which also formats its registry `text` field for the terminal. There is no separate About Me window/file; the three document launchers are README, Experience and Leadership. Work/leadership content is also shared rather than copied.

The terminal's virtual `~` directory mirrors the desktop documents, links, resumes and featured projects. `getProjectGroups` from `data/projectLayout.js` selects the same three featured IDs, in order, for both views; remaining project files are under `~/More Projects/`. Omit that folder when no additional projects exist, as on the desktop. Navigation and completion support relative, `~/` and `/` paths and directory names containing spaces. `cat`/`grep` wildcards match filenames within the selected directory (for example, `cat "More Projects/*.proj"`); they do not recursively expand directory patterns. This is an in-memory explorer, not a system shell. See README for the command list; `ls` accepts a path but no flags, and the old `head`, `tail`, `resume`, `projects` and `about` commands are absent.

Shell help is built from `HELP_ENTRIES` in `TerminalWindow.jsx`. The longest command label determines description padding, including `grep <term> <file>`. Preserve monospace/preformatted output and the command-list-only presentation; longer instructions belong in manual pages or editor help.

### Custom Vim

`TerminalWindow` owns the filesystem for its entire mounted lifetime and passes a read/write adapter to `VimEditor`. Writes update only these virtual entries, including new text files in existing folders; PDF entries remain non-editable. Closing Vim retains written files, while closing Terminal resets the filesystem. Unsaved buffers prompt on editor quit; the window's Close control retains its normal immediate-close behavior.

`VimSession` is a dependency-free state machine with per-buffer undo/redo, modes, counted motions/operators, text objects, registers, macros, marks, dot repeat, search/substitution and Ex-style file/buffer commands. `VIM_HELP` is the command reference. This is not upstream Vim and does not support Vimscript, plugins, shell execution, split windows or visual-block mode; regex patterns use JavaScript syntax. Keep help and implementation aligned.

The UI uses a native textarea for editing/IME input and selection, with a non-interactive, aria-hidden syntax layer. Highlighting renders React text, never raw HTML. Scroll positions, tab width and line metrics must stay synchronized across text, syntax and gutter. Both themes retain the reference's classic black surface, warm text/line numbers, magenta comments, violet built-ins, cyan filler lines and gray block cursor. Desktop has no editor toolbar; mobile has small touch keys below the command line. Escape is contained inside Vim, Tab indents in Insert/Replace mode, and Shift+Tab leaves the editor.

## Browser verification

Lint and build cannot detect visual regressions. There is no committed browser test suite. Use an actual browser, inspect screenshots, and report tested behavior and remaining limitations.

Put ad hoc browser-audit scripts, screenshots and temporary browser profiles in the ignored `.preview.local/` directory. This disposable workspace is separate from Vite's `npm run preview` command and from the generated `app/dist/` production build.

1. **Desktop composition:** inspect 1440x900, 1024x600 and 820x600 in both themes. Branding, labels, resumes and controls must not overlap. Check a short viewport such as 820x300 and scroll to every launcher.
2. **Icon geometry and motion:** inspect changed icons at actual size and 4-8x enlargement. Check idle, hover entry, intermediate frames, full hover, exit and keyboard focus. Look for detached glows, protruding panels, inconsistent outlines and clipping. Check repeated SVG instances have unique IDs.
3. **Every project:** open all seven, verify headings/links and scroll to the last caption. Hover the detail icon/header and focus links; idle animation must not change. Repeat in dark mode.
4. **Fullscreen:** maximize/restore at 1440, 1920 and 2560px widths. Compare article width with content client width, not just outer window width. Scroll to the bottom and check title-bar controls.
5. **Window interaction:** drag to viewport edges; resize from all eight handles, check minimum/viewport limits and bottom-right arrow-key sizing; reopen existing windows, switch overlapping windows by mouse and keyboard, and use Escape. Verify visible stacking matches the active window. Inspect intermediate resize frames and release for opening-animation replay. Check chosen dimensions survive fullscreen/restore and mobile transitions, and resize terminal/Vim and PDF windows as well as projects. Close or cross the mobile breakpoint during a gesture and check capture/cursor cleanup.
6. **More Projects:** open a child, use Back, and close. On mobile, verify the folder-to-child transition never flashes the desktop. Repeat after maximizing and restoring the child. Verify fullscreen state and focus return to the folder; custom resized dimensions are not transferred across these handoffs.
7. **Mobile and zoom:** test 320px, 390px and the exact 768px breakpoint; resize from 820px to mobile and back with a window open. Check overflow, scroll locking, long titles, controls and browser zoom/reflow.
8. **Keyboard and motion:** test Tab, Shift+Tab, Enter, Escape, terminal completion/history, and reduced motion. In Vim check editing, counted operators, undo/redo, macros, search/substitute, buffers, `:wq`, unsaved `:q`, discard, help/Escape, syntax/cursor alignment while scrolling and mobile touch keys. Verify saved virtual files through `cat`; window close/reopen resets them. Check detail pages as well as desktop launchers.
9. **Failure states:** test failed project fetch and Retry, empty data, and a failed image. Check all local photos and both PDFs return real image/PDF data, not fallback HTML. Inspect console errors.
10. **Project links:** directly load and refresh every project slug in a production preview. Check non-fullscreen desktop entry, mobile layout, Close/Escape without reopening, More Projects Back, unknown/malformed paths, ID/query aliases, delayed loading and failure followed by Retry. Verify path rewrites separately on the deployed host; local preview fallback does not prove hosting configuration.
11. **Documents:** verify the three launchers are README, Experience and Leadership. README contains the biography, all skills and the portfolio description; Experience contains the work roles; Leadership is ordered Star Wars Club, Roblox + RBXDev, then TEA. Compare terminal `ls`/`cat`, Tab completion and Vim reads with these windows. Check scrolling and controls on desktop, mobile and in resized windows.
12. **Final review:** review the diff and rerun checks affected by fixes. Keep generated builds out of commits and confirm local screenshot/test artifacts remain under `.preview.local/`.

For animation comparisons, inspect names/timing or pause animations at the same timestamp; unrelated live frames can mistake idle motion for a hover regression. The first frame alone cannot verify an animated icon.
