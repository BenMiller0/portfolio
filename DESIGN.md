# Design Document - Benjamin Miller Portfolio Website

## Overview

This portfolio is a React/Vite single-page app with a desktop-inspired interface. It presents projects, resumes, experience, social links, and a terminal-style explorer through draggable window components.

**Live Site:** https://benjaminmillerportfolio.onrender.com/

The current architecture keeps `App.jsx` focused on application orchestration while moving layout math, static registry data, and animation behavior into smaller modules.

## Technology Stack

- **Frontend Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Custom CSS with dark mode and responsive mobile overrides
- **Content Data:** `public/projects.json`
- **Deployment:** Static deployment on Render

## Project Structure

```text
portfolio/
|-- README.md
|-- DESIGN.md
`-- app/
    |-- public/
    |   |-- projects.json
    |   |-- project_photos/
    |   |-- hardware_resume.pdf
    |   |-- software_resume.pdf
    |   |-- doc-icon.png
    |   |-- file-text-icon.png
    |   |-- github.png
    |   |-- linkedIn.png
    |   `-- favcon.png
    `-- src/
        |-- App.jsx
        |-- main.jsx
        |-- assets/
        |   `-- styles.css
        |-- components/
        |   `-- Window.jsx
        |-- constants/
        |   `-- windowLayout.js
        |-- data/
        |   `-- windowRegistry.jsx
        |-- hooks/
        |   `-- useTypewriter.js
        `-- windows/
            |-- ProjectWindowContent.jsx
            |-- TerminalWindow.jsx
            |-- aboutWindow.jsx
            |-- experienceWindow.jsx
            `-- readmeWindow.jsx
```

## Module Responsibilities

### `src/App.jsx`

`App.jsx` is the application shell. It composes the desktop, icons, project folders, resume icons, dark mode toggle, and active windows.

It owns:

- Loading project data from `/projects.json`
- Window lifecycle state
- Window focus and z-index updates
- Window position updates from drag events
- Fullscreen toggling
- Dark mode class toggling
- Splitting projects into primary projects and the "More Projects" window

`App.jsx` should stay mostly orchestration-focused. New static icon data should usually go into `data/windowRegistry.jsx`, and new positioning behavior should usually go into `constants/windowLayout.js`.

### `src/components/Window.jsx`

`Window.jsx` is the reusable window shell.

It owns:

- Title bar rendering
- Close, fullscreen, and optional back controls
- Header color mapping
- Mouse and touch drag behavior
- Immediate focus/z-index adjustments during interaction
- Mobile drag disabling

The component receives content through `children`, so project windows, static text windows, terminal windows, and resume viewers can all share the same chrome.

### `src/constants/windowLayout.js`

This module centralizes viewport and positioning rules:

- `MOBILE_BREAKPOINT`
- `WINDOW_LAYOUT`
- `isMobileViewport()`
- `calculateWindowPosition()`
- `calculateRestorePosition()`

Keeping these constants here makes it easier to tune desktop/mobile window behavior without digging through the main app component.

### `src/data/windowRegistry.jsx`

This module stores desktop metadata:

- `systemWindows` for About, README, and Experience windows
- `terminalDesktopWindow` for the terminal icon/window config
- `socialLinks` for GitHub and LinkedIn icons
- `resumeLinks` for hardware and software resume icons

When adding a new static desktop icon, prefer updating this registry instead of adding another hard-coded block in `App.jsx`.

### `src/hooks/useTypewriter.js`

Reusable hook for character-by-character text animation.

It accepts:

- `text`
- `delay`
- `startDelay`

It returns:

- `value`, the currently typed text
- `done`, whether typing has completed

The intro name and school text use this hook.

### `src/windows/`

Window content lives here:

- `aboutWindow.jsx` exports the About Me window config
- `readmeWindow.jsx` exports the site README window config
- `experienceWindow.jsx` stores experience data as objects and renders the list from data
- `ProjectWindowContent.jsx` renders JSON-backed project details
- `TerminalWindow.jsx` implements the terminal-style file explorer

Static windows export config objects with this shape:

```jsx
export const aboutWindow = {
  id: 'aboutWindow',
  title: 'About Me',
  label: 'about_me.txt',
  color: '#a78bfa',
  component: AboutContent
};
```

## Data Flow

### Project Loading

1. `App.jsx` mounts.
2. It fetches `/projects.json`.
3. Projects are stored in React state.
4. The first three projects render as primary desktop folders.
5. Remaining projects render inside the "More Projects" window.
6. Each project opens `ProjectWindowContent` inside the shared `Window` shell.

### Window Lifecycle

1. User clicks an icon or folder.
2. `openWindow()` checks whether the window ID is already open.
3. Existing windows are brought to front.
4. New windows receive a calculated position, z-index, title, content, optional back handler, fullscreen flag, and header color.
5. `openWindows.map(...)` renders each `Window`.
6. Drag, close, focus, back, and fullscreen events flow back into `App.jsx` through callbacks.

### Registry-Driven Icons

Static desktop icons are rendered from registry data:

- Text windows come from `systemWindows`
- Terminal comes from `terminalDesktopWindow`
- External profile links come from `socialLinks`
- Resume viewers come from `resumeLinks`

This keeps repeated JSX out of the main component and makes new icons easier to add.

## Styling System

### Main CSS File

All styling currently lives in `src/assets/styles.css`.

Primary sections:

1. Base styles
2. Background and branding
3. Desktop icons and folders
4. Window chrome and window content
5. Project photos
6. Experience list
7. Resume viewer
8. Dark mode overrides
9. Mobile overrides
10. Terminal styles

Window header styles now share a base rule for layout and typography, with color-specific classes only overriding color and text shadow.

### Responsive Strategy

Desktop:

- Fixed viewport
- Draggable windows
- Multiple windows visible
- Resume icons positioned on the right

Mobile:

- Scrollable desktop content
- Windows centered
- Dragging disabled
- Fullscreen window mode prevents body scroll
- Resume icons move into normal document flow

## Maintenance Guide

### Add A Project

Update `app/public/projects.json`:

```json
{
  "id": "project8",
  "label": "Short Desktop Label",
  "title": "Full Project Title",
  "description": "First bullet\nSecond bullet",
  "technologies": "React, Vite, CSS",
  "github": "https://github.com/user/repo",
  "photos": ["example.png"],
  "imageSize": "medium",
  "miscLink": {
    "displayName": "Demo",
    "url": "https://example.com"
  }
}
```

Then add images to `app/public/project_photos/`.

### Add A Static Window

1. Create a new file in `app/src/windows/`.
2. Export a component and window config object.
3. Register the config in `app/src/data/windowRegistry.jsx`.

Example:

```jsx
const ContactContent = () => (
  <>
    <h2>Contact</h2>
    <p>Contact details go here.</p>
  </>
);

export const contactWindow = {
  id: 'contactWindow',
  title: 'Contact',
  label: 'contact.txt',
  color: '#a78bfa',
  component: ContactContent
};
```

Then:

```jsx
export const systemWindows = {
  aboutWindow,
  aboutSiteWindow,
  experienceWindow,
  contactWindow
};
```

### Add A Resume Or External Link

Update `resumeLinks` or `socialLinks` in `app/src/data/windowRegistry.jsx`.

### Tune Window Layout

Update `app/src/constants/windowLayout.js` for:

- Breakpoint changes
- Default desktop/mobile window sizes
- Initial y positions
- Cascading window offset
- Restore-from-fullscreen position

### Update Experience

Edit the `experiences` array in `app/src/windows/experienceWindow.jsx`. The component renders the list from data, so no repeated JSX blocks are needed.

## Accessibility Notes

Implemented:

- Semantic headings and lists inside windows
- ARIA labels on close/fullscreen controls
- Keyboard-accessible button elements
- Mobile tap target adjustments
- Dark mode contrast overrides

Possible future improvements:

- Focus trapping inside active fullscreen windows
- Keyboard shortcuts for close/fullscreen
- Keyboard window movement
- Better screen reader announcements when windows open or close

## Deployment

Render static site settings:

- Build command: `cd app && npm install && npm run build`
- Output directory: `app/dist`

SPA fallback is handled by `app/public/_redirects`:

```text
/* /index.html 200
```

## Future Improvements

- Persist dark mode preference with `localStorage`
- Persist window positions between visits
- Split very large CSS sections into smaller files if the styling surface grows
- Add keyboard navigation for active windows
- Lazy-load larger project images
- Add lightweight tests for window positioning helpers and project rendering
