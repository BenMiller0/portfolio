# Benjamin Miller Portfolio Website

**Visit site here: https://benjaminmillerportfolio.onrender.com/**

A personal portfolio website built with **React** and **Vite**, featuring a desktop-inspired interface for projects in embedded systems, AI/ML, and web development. The app uses draggable windows, desktop-style icons, responsive mobile behavior, a terminal view, resume viewers, and a JSON-driven project showcase.

See [DESIGN.md](./DESIGN.md) for detailed architecture and maintenance notes.

---

## Tech Stack

- **Frontend:** React 19 + Vite
- **Styling:** Custom CSS with dark mode support
- **Data:** JSON-based project configuration
- **Structure:** Small React modules for layout constants, shared window metadata, and reusable hooks

---

## Features

- Desktop-inspired interface with draggable windows
- Responsive desktop and mobile layouts
- Dark mode toggle
- Project showcase with photo galleries and external links
- Interactive folder/document icons
- Fullscreen window support
- Window stacking with z-index management
- Animated typewriter intro
- Interactive terminal window
- Resume PDF viewers

---

## Project Structure

```text
portfolio/
|-- .gitignore
|-- DESIGN.md
|-- README.md
`-- app/
    |-- eslint.config.js
    |-- index.html
    |-- package.json
    |-- package-lock.json
    |-- vite.config.js
    |-- public/
    |   |-- _redirects
    |   |-- doc-icon.png
    |   |-- favcon.png
    |   |-- github.png
    |   |-- hardware_resume.pdf
    |   |-- linkedIn.png
    |   |-- project_photos/
    |   |-- projects.json
    |   `-- software_resume.pdf
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

---

## Architecture Notes

- `App.jsx` owns the page composition and window lifecycle: opening, closing, focus order, dragging updates, fullscreen state, project loading, and dark mode.
- `components/Window.jsx` owns reusable window chrome: title bar, controls, drag/touch handlers, header color class mapping, and content shell.
- `constants/windowLayout.js` owns window positioning constants and viewport helpers so layout math is not buried inside `App.jsx`.
- `data/windowRegistry.jsx` owns static desktop metadata for system windows, social links, and resume links.
- `hooks/useTypewriter.js` owns the reusable typewriter animation used by the intro text.
- `windows/` contains focused content modules. Static windows export a config object with `title`, `label`, `color`, and `component`.
- `public/projects.json` remains the source of truth for project cards and project detail windows.

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn

### Installation

```bash
git clone https://github.com/BenMiller0/portfolio.git
cd portfolio/app
npm install
npm run dev
```

### Production Build

```bash
npm run build
```

---

## Maintaining Content

### Add A Project

1. Add the project entry to `app/public/projects.json`.
2. Add any images to `app/public/project_photos/`.
3. Use `imageSize` values such as `small`, `medium`, `large`, or `xlarge` to control gallery sizing.

### Add A Desktop Window

1. Create a module in `app/src/windows/`.
2. Export a window config object:

```jsx
export const newWindow = {
  id: 'newWindow',
  title: 'Window Title',
  label: 'window_label.txt',
  color: '#a78bfa',
  component: NewWindowContent
};
```

3. Register it in `app/src/data/windowRegistry.jsx`.

### Add A Static Desktop Link

Update `socialLinks` or `resumeLinks` in `app/src/data/windowRegistry.jsx` instead of editing icon markup directly in `App.jsx`.
