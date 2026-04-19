# Benjamin Miller Portfolio Website

**Visit site here: https://benjaminmillerportfolio.onrender.com/**

A personal portfolio website built with **React** and **Vite**, featuring a desktop-inspired interface to showcase projects in embedded systems, AI/ML, and web development. The portfolio demonstrates interactive window management, drag-and-drop functionality, and a nostalgic desktop UI experience.

**See [DESIGN.md](./DESIGN.md) for detailed architecture and implementation documentation.**



---

## 🛠 Tech Stack

- **Frontend:** React 19 + Vite  
- **Styling:** Custom CSS with dark mode support  
- **Data Management:** JSON-based project configuration  

---

## Features

- Desktop-inspired interface with draggable windows
- Responsive design supporting both desktop and mobile
- Dark mode toggle for accessibility
- Project showcase with photo galleries and external links
- Interactive folder icons for navigation
- Fullscreen window support
- Z-index management for window stacking
- Animated text typing effect for name and school display
- Smooth window opening animations with scale and fade effects

---

## Featured Projects

The portfolio showcases diverse projects including:

- **Interactive Robotic Figure** - Real-time audio-to-motion translation using C/C++, Raspberry Pi, and Arduino
- **Computer Vision Spell Casting** - Edge-AI system with MQTT architecture for hardware actuation
- **ML Theme Park Wait Times** - Predictive modeling using Python and scikit-learn
- **Campus Events Planner** - Full-stack web application with JavaScript
- **TEA @ UCSD Website** - Club website with Tailwind CSS and GitHub Actions
- **Multithreaded File Compressor** - High-performance C++ compression utility

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BenMiller0/portfolio.git
cd portfolio/app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

---

## Project Structure

```
portfolio/
├── .gitignore
├── DESIGN.md
├── README.md
└── app/
    ├── eslint.config.js           # ESLint configuration
    ├── index.html                 # HTML template
    ├── package.json               # Dependencies
    ├── package-lock.json
    ├── vite.config.js             # Vite configuration
    ├── public/
    │   ├── _redirects             # SPA routing configuration
    │   ├── doc-icon.png           # Document icon
    │   ├── favcon.png             # Site favicon
    │   ├── github.png             # GitHub icon
    │   ├── hardware_resume.pdf    # Hardware resume
    │   ├── linkedIn.png           # LinkedIn icon
    │   ├── project_photos/        # Project image assets
    │   ├── projects.json          # Project data configuration
    │   └── software_resume.pdf    # Software resume
    └── src/
        ├── App.jsx                # Main application component
        ├── main.jsx               # React entry point
        ├── assets/
        │   └── styles.css         # Global styles and theming
        ├── components/
        │   └── Window.jsx         # Draggable window component
        └── windows/
            ├── ProjectWindowContent.jsx  # Project detail view
            ├── aboutWindow.jsx          # About me window
            ├── experienceWindow.jsx     # Experience window
            └── readmeWindow.jsx         # Site info window
```

---