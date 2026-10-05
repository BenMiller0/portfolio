# Portfolio design and maintenance

This document describes the current React/Vite application. See [README.md](README.md) for setup and hosting commands and [AGENTS.md](AGENTS.md) for contribution requirements.

## Architecture

Paths below are relative to `app/src/`.

| Module | Responsibility |
| --- | --- |
| `App.jsx` | Fetch projects, compose desktop icons, manage windows and theme |
| `components/Window.jsx` | Dialog shell, controls, pointer dragging, focus restoration and containment |
| `constants/windowLayout.js` | `MOBILE_BREAKPOINT`, initial placement and restore-position estimates |
| `hooks/useMobileViewport.js` | Subscribe to the breakpoint with `matchMedia` and `useSyncExternalStore` |
| `hooks/useTypewriter.js` | Intro text and reduced-motion behavior |
| `data/windowRegistry.jsx` | `systemWindows`, `getTerminalDesktopWindow(projects)`, `socialLinks`, `resumeLinks` |
| `windows/ProjectWindowContent.jsx` | Masthead, descriptions, technologies, gallery and failed-image fallback |
| `windows/TerminalWindow.jsx` | In-memory file explorer, commands, completion and history |
| `windows/aboutWindow.jsx`, `readmeWindow.jsx`, `experienceWindow.jsx` | Static window content |

The on-site README window is a React content module; it does not render the repository's `README.md`.

### Project loading

`App.jsx` fetches `/projects.json`, checks for a list, and filters records for string `id`, `label` and `title` fields. This is basic validation, not a complete schema validator. Authors must validate optional fields and ensure IDs are unique.

Loading placeholders become project buttons after success. Empty data and failed requests have separate states; the error button retries the fetch. `MAIN_PROJECT_IDS` selects `project1`, `project3` and `project4` in that order. JSON array order does not choose the featured projects. Remaining records populate More Projects.

### Window lifecycle

`openWindows` stores IDs, titles, content elements, positions, z-indices, fullscreen flags, optional Back callbacks, header colors and focus-return targets. Opening an existing ID raises and focuses its window. Pointer interaction and keyboard focus entering a window raise it. Escape closes the window with the highest state z-index.

`Window.jsx` uses pointer capture while dragging. Placement helpers supply initial estimates; a layout effect and `ResizeObserver` clamp restored windows using actual dimensions. Restore calculates a fresh position rather than remembering the pre-fullscreen drag position.

More Projects opens a child and closes the folder window. Back reopens More Projects using the child's current fullscreen state. The desktop folder button remains the focus-return target, avoiding attempts to focus detached controls.

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

Mobile is **768px inclusive** in CSS and JavaScript. It uses a scrollable desktop, bottom dock for terminal/social links, and viewport-filling windows with hidden fullscreen controls.

Above that breakpoint, windows remain draggable and the name and school line stay horizontally centered. At up to 1280px wide or up to 800px high, branding sits below the icon rows to avoid overlap. Desktop viewports at most 500px high use a centered header above a scrollable icon area, with the theme control in the header. These layout adjustments are separate from mobile window behavior. Larger desktops keep resumes at the right and the terminal at the lower left.

## Project data

Example record in `app/public/projects.json`:

```json
{
  "id": "project8",
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
- `description` is split into paragraphs at newlines. `technologies` is a comma-separated string.
- `photos` is an array of filenames in `app/public/project_photos/`; omit it or use an empty array for no gallery. Filenames are URL-encoded and case must match the assets.
- `github` and `miscLink.url` should be HTTP(S) links. Project-page links are filtered to those protocols and open in a new tab.
- `imageSize` is legacy and unused. Control sizing through CSS.

Pages use solid project-colored mastheads, restrained link buttons, section labels, dividers, plain technologies lists and unframed photos. Section order is **About**, **Technologies used**, **Photo Gallery**; empty sections are omitted. Optional summaries and filename-based captions live in `ProjectWindowContent.jsx`.

Photos preserve aspect ratio and use two desktop columns or one mobile column. Links open the originals without a visible "View full size" overlay. A failed image replaces its link with an "Image unavailable" fallback.

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

Define `ContactContent`, register the config in `systemWindows`, and add its visual to `DesktopIcon.jsx`. Registry IDs and visual mappings are separate. Edit the `experiences` array in `experienceWindow.jsx` for experience content.

Resume/social metadata live in `windowRegistry.jsx`. The terminal also contains static About, Experience, social and resume file content; update those copies when the associated information changes. Terminal project files are generated from project records. This is an in-memory explorer, not a system shell.

## Browser verification

Lint and build cannot detect visual regressions. There is no committed browser test suite. Use an actual browser, inspect screenshots, and report tested behavior and remaining limitations.

1. **Desktop composition:** inspect 1440x900, 1024x600 and 820x600 in both themes. Branding, labels, resumes and controls must not overlap. Check a short viewport such as 820x300 and scroll to every launcher.
2. **Icon geometry and motion:** inspect changed icons at actual size and 4-8x enlargement. Check idle, hover entry, intermediate frames, full hover, exit and keyboard focus. Look for detached glows, protruding panels, inconsistent outlines and clipping. Check repeated SVG instances have unique IDs.
3. **Every project:** open all seven, verify headings/links and scroll to the last caption. Hover the detail icon/header and focus links; idle animation must not change. Repeat in dark mode.
4. **Fullscreen:** maximize/restore at 1440, 1920 and 2560px widths. Compare article width with content client width, not just outer window width. Scroll to the bottom and check title-bar controls.
5. **Window interaction:** drag to viewport edges, resize, reopen existing windows, switch overlapping windows by mouse and keyboard, and use Escape. Verify visible stacking matches the active window.
6. **More Projects:** open a child, use Back, and close. Repeat after maximizing and restoring the child. Verify size and focus return to the folder.
7. **Mobile and zoom:** test 320px, 390px and the exact 768px breakpoint; resize from 820px to mobile and back with a window open. Check overflow, scroll locking, long titles, controls and browser zoom/reflow.
8. **Keyboard and motion:** test Tab, Shift+Tab, Enter, Escape, terminal completion/history, and reduced motion. Check detail pages as well as desktop launchers.
9. **Failure states:** test failed project fetch and Retry, empty data, and a failed image. Check all local photos and both PDFs return real image/PDF data, not fallback HTML. Inspect console errors.
10. **Final review:** review the diff and rerun checks affected by fixes. Keep builds and local screenshot/test artifacts out of commits.

For animation comparisons, inspect names/timing or pause animations at the same timestamp; unrelated live frames can mistake idle motion for a hover regression. The first frame alone cannot verify an animated icon.
