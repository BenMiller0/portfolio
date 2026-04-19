# Design Document - Benjamin Miller Portfolio Website

## Overview

This is a personal portfolio website featuring a desktop-inspired interface that showcases projects in embedded systems, AI/ML, and web development. The site provides a nostalgic desktop UI experience with draggable windows, folder navigation, and interactive elements.

**Live Site:** https://benjaminmillerportfolio.onrender.com/

## Architecture

### Technology Stack

- **Frontend Framework:** React 19.1.0
- **Build Tool:** Vite 7.0.0
- **Styling:** Custom CSS with CSS variables and dark mode support
- **Data Management:** JSON-based project configuration
- **Deployment:** Render (static deployment)

### Project Structure

```
portfolio/
├── app/
│   ├── public/
│   │   ├── projects.json          # Project data configuration
│   │   ├── project_photos/         # Project image assets
│   │   ├── hardware_resume.pdf    # Hardware resume
│   │   ├── software_resume.pdf    # Software resume
│   │   ├── doc-icon.png           # Document icon
│   │   ├── github.png             # GitHub icon
│   │   ├── linkedIn.png           # LinkedIn icon
│   │   └── favcon.png             # Site favicon
│   ├── src/
│   │   ├── components/
│   │   │   └── Window.jsx         # Draggable window component
│   │   ├── windows/
│   │   │   ├── ProjectWindowContent.jsx  # Project detail view
│   │   │   ├── aboutWindow.jsx          # About me window
│   │   │   ├── experienceWindow.jsx     # Experience window
│   │   │   └── readmeWindow.jsx         # Site info window
│   │   ├── assets/
│   │   │   └── styles.css         # Global styles and theming
│   │   ├── App.jsx                # Main application component
│   │   └── main.jsx               # React entry point
│   ├── index.html                 # HTML template
│   ├── package.json               # Dependencies
│   └── vite.config.js             # Vite configuration
└── README.md
```

## Component Architecture

### App.jsx (Main Component)

The central component that manages:
- Window state (open/closed, position, z-index, fullscreen mode)
- Project data fetching from `projects.json`
- Dark mode state
- Window lifecycle management (open, close, bring to front, toggle fullscreen)

**Key State:**
```javascript
const [projects, setProjects] = useState([]);           // Project data
const [openWindows, setOpenWindows] = useState([]);     // Active windows
const [zIndexCounter, setZIndexCounter] = useState(100); // Z-index management
const [darkMode, setDarkMode] = useState(false);        // Theme toggle
```

**Key Functions:**
- `openWindow()` - Opens new window or brings existing to front
- `closeWindow()` - Removes window from state
- `bringToFront()` - Updates z-index for window stacking
- `updateWindowPosition()` - Handles drag updates
- `toggleFullscreen()` - Switches between windowed/fullscreen modes
- `openResumeViewer()` - Specialized window for PDF viewing

### Window.jsx (Reusable Window Component)

A draggable, resizable window component with:
- Mouse and touch event handling for dragging
- Z-index management for stacking
- Fullscreen toggle capability
- Custom header colors via CSS classes
- Back button support for navigation hierarchies

**Header Color Mapping:**
- `lightgreen` → `.window-header-green`
- `orange` → `.window-header-orange`
- `#f2f2f2` → `.window-header-gray`
- `#cc3333` → `.window-header-red` (resume windows)

**Drag Logic:**
- Desktop: Full drag support via mouse/touch
- Mobile: Drag disabled (windows centered, fullscreen recommended)
- Offset calculation maintains relative cursor position

### ProjectWindowContent.jsx

Displays project details including:
- Title and description (with bullet point parsing)
- Technologies used
- Photo gallery with responsive sizing
- External links (GitHub, demo videos, project pages)

**Photo Sizing:**
- `small` → 100px max width
- `medium` → 300px max width
- `large` → 400px max width
- `xlarge` → 500px max width

### Window Content Components

Located in `src/windows/`:
- **aboutWindow.jsx** - Personal information window
- **experienceWindow.jsx** - Work/experience history
- **readmeWindow.jsx** - Site information and usage

Each exports an object with:
```javascript
{
  title: "Window Title",
  label: "Icon Label",
  component: ReactComponent,
  color: "header-color"
}
```

## Data Flow

### Project Data Loading

1. App component mounts
2. `useEffect` fetches `/projects.json`
3. JSON parsed and stored in `projects` state
4. Projects split into `mainProjects` (first 3) and `moreProjects` (remainder)
5. Main projects displayed in desktop grid
6. "More Projects" folder opens secondary window with remaining projects

### Window Management Flow

1. User clicks folder icon
2. `openWindow()` called with window ID, title, content, and optional color
3. Check if window already exists (by ID)
   - If yes: Bring to front (update z-index)
   - If no: Create new window with calculated position
4. Window added to `openWindows` array
5. Window component rendered with state
6. User interactions update state via callbacks

### Z-Index Management

- Counter starts at 100
- Each window focus increments counter
- `bringToFront()` assigns new highest z-index to focused window
- Prevents windows from getting stuck behind others

## Styling System

### CSS Architecture

**File:** `src/assets/styles.css` (1100 lines)

**Organization:**
1. Base styles (reset, typography)
2. Background elements (gradient, grid pattern, logo)
3. Branding (name display, school display)
4. Desktop interface (icons, folders)
5. Window system (headers, content, controls)
6. Photo galleries
7. Resume viewer
8. Dark mode styles (comprehensive overrides)
9. Mobile responsive styles (media query @ 768px)

### Design Tokens

**Colors (Light Mode):**
- Background: `#182B3A` → `#0A4D6E` gradient
- Accent: `#00A3E0` (UCSD blue)
- Window background: `rgba(255, 255, 255, 0.95)`
- Text: `#2c3e50`

**Colors (Dark Mode):**
- Background: `#0f0f2e` → `#082a50` gradient
- Accent: `#6ECFF5` → `#00A3E0` gradient
- Window background: `rgba(26, 33, 62, 0.96)`
- Text: `#f0f0f0`

**Breakpoints:**
- Mobile: `< 768px`
- Desktop: `>= 768px`

### Responsive Design Strategy

**Desktop (>= 768px):**
- Fixed viewport (no scroll)
- Windows draggable
- Multiple windows visible
- Resume icons positioned absolute (right side)

**Mobile (< 768px):**
- Scrollable viewport
- Windows centered, non-draggable
- Single window focus (fullscreen recommended)
- Resume icons in flow at bottom
- Touch-optimized tap targets

**Mobile Overrides:**
- `html, body` → `overflow-y: auto`
- `.desktop-background` → `position: fixed`
- `.desktop` → `height: auto`, `min-height: 100vh`
- `.window` → `width: 95vw`, centered
- Disable scroll when fullscreen window open

## Key Features

### 1. Desktop-Inspired Interface

- Folder icons for navigation
- Draggable windows with title bars
- Window controls (close, fullscreen, back)
- Z-index stacking for multiple windows
- Position calculation with cascading offset

### 2. Responsive Window Positioning

**Mobile:**
```javascript
const MOBILE_WIDTH_PERCENT = 0.90;
const MOBILE_MAX_WIDTH = 500;
const MOBILE_START_Y = 140;
```

**Desktop:**
```javascript
const DESKTOP_WIDTH_PERCENT = 0.60;
const DESKTOP_MAX_WIDTH = 600;
const DESKTOP_HEIGHT_PERCENT = 0.70;
const DESKTOP_MAX_HEIGHT = 500;
const DESKTOP_START_Y = 80;
```

### 3. Dark Mode

- Toggle button in bottom-right corner
- Smooth CSS transitions (0.5s ease)
- Comprehensive color scheme overrides
- Maintains readability and contrast
- Persists across window states

### 4. Project Showcase

- JSON-driven project configuration
- Photo galleries with responsive sizing
- External links (GitHub, demos, project pages)
- Categorized display (main vs. more projects)
- Bullet point description parsing

### 5. Resume Viewer

- PDF embedding via iframe
- Fullscreen mode for better readability
- Download button for offline access
- Separate hardware and software resumes
- Mobile fallback message

### 6. Window Management

- Open/close windows dynamically
- Prevent duplicate windows (same ID)
- Back button for navigation hierarchies
- Fullscreen toggle for content focus
- Auto-positioning to prevent overlap

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading:** Projects fetched on mount, not initial bundle
2. **CSS Variables:** Theme switching via class toggles, not inline styles
3. **Event Cleanup:** Drag event listeners removed on unmount
4. **Conditional Rendering:** Windows only rendered when open
5. **Image Sizing:** Responsive photo classes prevent layout shift

### Bundle Size

- React 19 (modern, tree-shakeable)
- Vite for optimized production builds
- No heavy external libraries
- Custom CSS (no framework overhead)

## Accessibility

### Implemented Features

- Semantic HTML structure
- ARIA labels on window controls
- Keyboard-accessible buttons
- Touch-optimized mobile targets
- Sufficient color contrast in both themes
- Text scaling support (clamp functions)

### Considerations

- Window drag is mouse/touch only (keyboard alternative not implemented)
- Screen reader optimization could be improved
- Focus management for window cycling could be enhanced

## Deployment

### Build Process

```bash
npm run build    # Vite production build
npm run preview  # Preview production build
```

### Hosting

- Platform: Render
- Type: Static site
- Build command: `cd app && npm install && npm run build`
- Output directory: `app/dist`
- Environment: Node.js

### Redirects

File: `app/public/_redirects`
```
/* /index.html 200
```

Handles client-side routing for single-page app.

## Future Enhancements

### Potential Improvements

1. **Keyboard Navigation**
   - Tab through windows
   - Arrow keys for window positioning
   - Escape to close windows

2. **State Persistence**
   - Save window positions to localStorage
   - Remember dark mode preference
   - Restore last open windows

3. **Animation Enhancements**
   - Window open/close animations
   - Smooth position transitions
   - Icon hover effects

4. **Content Expansion**
   - Blog section
   - Contact form
   - Skills visualization
   - Testimonials

5. **Performance**
   - Image lazy loading
   - Code splitting for window components
   - Service worker for offline support

## Maintenance

### Adding New Projects

1. Add entry to `app/public/projects.json`:
```json
{
  "id": "project7",
  "label": "Project Label",
  "title": "Full Project Title",
  "description": "Multi-line\ndescription",
  "technologies": "Tech1, Tech2, Tech3",
  "github": "https://github.com/user/repo",
  "photos": ["photo1.jpg", "photo2.jpg"],
  "imageSize": "medium",
  "miscLink": {
    "displayName": "Demo",
    "url": "https://demo.com"
  }
}
```

2. Add photos to `app/public/project_photos/`

### Adding New Windows

1. Create component in `src/windows/`
2. Export configuration object:
```javascript
export const newWindow = {
  title: "Window Title",
  label: "Icon Label",
  component: NewWindowComponent,
  color: "header-color"
};
```

3. Add to `windowsInfo` object in `App.jsx`

### Styling Changes

- Modify `src/assets/styles.css`
- Dark mode overrides in `.dark-mode` section
- Mobile overrides in `@media (max-width: 768px)` section

## Conclusion

This portfolio website successfully combines a nostalgic desktop interface with modern web technologies. The component-based architecture allows for easy maintenance and expansion, while the responsive design ensures accessibility across devices. The JSON-driven content management simplifies updates, and the comprehensive styling system provides a polished user experience in both light and dark modes.
