import React, { useState, useEffect } from 'react';
import './assets/styles.css';
import Window from './components/Window';
import ProjectWindowContent from './windows/ProjectWindowContent';
import { aboutWindow } from './windows/aboutWindow';
import { aboutSiteWindow } from './windows/readmeWindow';
import { experienceWindow } from './windows/experienceWindow';

// Constants
const MOBILE_BREAKPOINT = 768;
const MOBILE_WIDTH_PERCENT = 0.90;
const MOBILE_MAX_WIDTH = 500;
const MOBILE_START_Y = 140;
const DESKTOP_WIDTH_PERCENT = 0.60;
const DESKTOP_MAX_WIDTH = 600;
const DESKTOP_HEIGHT_PERCENT = 0.70;
const DESKTOP_MAX_HEIGHT = 500;
const DESKTOP_START_Y = 80;
const MIN_Y = 50;
const WINDOW_OFFSET = 30;

const windowsInfo = {
  aboutWindow,
  aboutSiteWindow,
  experienceWindow
};

// Helper Functions
const isMobileView = () => window.innerWidth < MOBILE_BREAKPOINT;

const calculateWindowPosition = (windowCount, isFullscreen = false) => {
  if (isFullscreen) {
    return { x: 0, y: 0 };
  }

  const mobile = isMobileView();
  let startX, startY;

  if (mobile) {
    const estimatedWidth = Math.min(window.innerWidth * MOBILE_WIDTH_PERCENT, MOBILE_MAX_WIDTH);
    startX = (window.innerWidth - estimatedWidth) / 2 + (windowCount * WINDOW_OFFSET);
    startY = MOBILE_START_Y + (windowCount * WINDOW_OFFSET);
  } else {
    const estimatedWidth = Math.min(window.innerWidth * DESKTOP_WIDTH_PERCENT, DESKTOP_MAX_WIDTH);
    const estimatedHeight = Math.min(window.innerHeight * DESKTOP_HEIGHT_PERCENT, DESKTOP_MAX_HEIGHT);
    startX = (window.innerWidth - estimatedWidth) / 2 + (windowCount * WINDOW_OFFSET);
    startY = DESKTOP_START_Y + (windowCount * WINDOW_OFFSET);
  }

  return { x: Math.max(0, startX), y: Math.max(MIN_Y, startY) };
};

const calculateRestorePosition = () => {
  const mobile = isMobileView();
  let startX, startY;

  if (mobile) {
    const estimatedWidth = Math.min(window.innerWidth * MOBILE_WIDTH_PERCENT, MOBILE_MAX_WIDTH);
    startX = (window.innerWidth - estimatedWidth) / 2;
    startY = MOBILE_START_Y;
  } else {
    const estimatedWidth = Math.min(window.innerWidth * DESKTOP_WIDTH_PERCENT, DESKTOP_MAX_WIDTH);
    const estimatedHeight = Math.min(window.innerHeight * DESKTOP_HEIGHT_PERCENT, DESKTOP_MAX_HEIGHT);
    startX = (window.innerWidth - estimatedWidth) / 2;
    startY = (window.innerHeight - estimatedHeight) / 2;
  }

  return { x: Math.max(0, startX), y: Math.max(MIN_Y, startY) };
};

const App = () => {
  const [projects, setProjects] = useState([]);
  const [openWindows, setOpenWindows] = useState([]);
  const [zIndexCounter, setZIndexCounter] = useState(100);
  const [darkMode, setDarkMode] = useState(false);
  const [typedName, setTypedName] = useState('');
  const [typedSchool, setTypedSchool] = useState('');
  const [showSchool, setShowSchool] = useState(false);

  const fullName = 'Benjamin Miller';
  const schoolName = 'UC San Diego - Computer Science';

  useEffect(() => {
    let nameIndex = 0;
    let schoolIndex = 0;

    const typeNextNameChar = () => {
      if (nameIndex < fullName.length) {
        setTypedName(fullName.slice(0, nameIndex + 1));
        nameIndex++;
        setTimeout(typeNextNameChar, 50);
      } else {
        setShowSchool(true);
        setTimeout(typeNextSchoolChar, 150);
      }
    };

    const typeNextSchoolChar = () => {
      if (schoolIndex < schoolName.length) {
        setTypedSchool(schoolName.slice(0, schoolIndex + 1));
        schoolIndex++;
        setTimeout(typeNextSchoolChar, 40);
      }
    };

    typeNextNameChar();
  }, []);

  useEffect(() => {
    fetch('/projects.json')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error('Failed to load projects:', err));
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  useEffect(() => {
    const hasFullscreen = openWindows.some(win => win.isFullscreen);
    if (hasFullscreen) {
      document.body.classList.add('fullscreen-window-open');
      document.documentElement.classList.add('fullscreen-window-open');
    } else {
      document.body.classList.remove('fullscreen-window-open');
      document.documentElement.classList.remove('fullscreen-window-open');
    }
  }, [openWindows]);

  const openWindow = (id, title, content, onBack = null, color = null) => {
    const existingIndex = openWindows.findIndex(win => win.id === id);
    if (existingIndex === -1) {
      const position = calculateWindowPosition(openWindows.length);

      setOpenWindows([
        ...openWindows,
        {
          id,
          title,
          content,
          position,
          zIndex: zIndexCounter,
          onBack,
          isFullscreen: false,
          color
        }
      ]);
      setZIndexCounter(zIndexCounter + 1);
    } else {
      bringToFront(id);
    }
  };

  const MoreProjectsContent = () => (
    <div className="more-projects-window">
      <h2>More Projects</h2>
      <div className="more-projects-grid">
        {moreProjects.map(p => (
          <div key={p.id} className="folder" onClick={(e) => {
            e.stopPropagation();
            openWindow(p.id, p.title, (
              <ProjectWindowContent project={p} />
            ), openMoreProjectsWindow);
          }}>
            <div className="folder-icon"></div>
            <div className="folder-name">{p.label}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const openMoreProjectsWindow = () => {
    openWindow('moreProjects', 'More Projects', <MoreProjectsContent />);
  };

  const closeWindow = (id) => setOpenWindows(openWindows.filter(win => win.id !== id));

  const bringToFront = (id) => {
    setOpenWindows(windows => windows.map(win => {
      if (win.id === id) {
        return { ...win, zIndex: zIndexCounter };
      }
      return win;
    }));
    setZIndexCounter(zIndexCounter + 1);
  };

  const updateWindowPosition = (id, newPos) => {
    setOpenWindows(openWindows.map(win => win.id === id ? { ...win, position: newPos } : win));
  };

  const toggleFullscreen = (id) => {
    setOpenWindows(windows => windows.map(win => {
      if (win.id === id) {
        const newFullscreen = !win.isFullscreen;
        if (newFullscreen) {
          return { ...win, isFullscreen: true, position: { x: 0, y: 0 } };
        } else {
          const position = calculateRestorePosition();
          return { ...win, isFullscreen: false, position };
        }
      }
      return win;
    }));
  };

  const ResumeViewerContent = ({ pdfPath, title }) => {
    const mobile = isMobileView();
    return (
      <div className="resume-viewer">
        <h2>{title}</h2>
        {mobile && <p>If the PDF doesn't display below, please use the download button.</p>}
        <iframe 
          src={pdfPath} 
          className="resume-iframe"
          title={`${title} Viewer`}
        />
        <a 
          href={pdfPath} 
          download 
          className="resume-download-btn"
        >
          Download Resume
        </a>
      </div>
    );
  };

  const openResumeViewer = (pdfPath, title) => {
    const windowId = title.replace(/\s+/g, '').toLowerCase();
    const existingIndex = openWindows.findIndex(win => win.id === windowId);
    
    if (existingIndex === -1) {
      setOpenWindows([
        ...openWindows,
        {
          id: windowId,
          title,
          content: <ResumeViewerContent pdfPath={pdfPath} title={title} />,
          position: { x: 0, y: 0 },
          zIndex: zIndexCounter,
          onBack: null,
          isFullscreen: true,
          color: '#cc3333'
        }
      ]);
      setZIndexCounter(zIndexCounter + 1);
    } else {
      bringToFront(windowId);
    }
  };

  const chunkProjects = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size));

  const mainProjects = projects.slice(0, 4);
  const moreProjects = projects.slice(4);
  const projectChunks = chunkProjects(mainProjects, 4);

  return (
    <>
      <div className="desktop-background"><div className="triton-logo"></div></div>
      <div className="name-display">{typedName}</div>
      {showSchool && <div className="school-display">{typedSchool}</div>}

      <div className="desktop">
        <div className="main-icons-container">
          <div className="system-icons">
            {Object.entries(windowsInfo).map(([id, win]) => (
              <div key={id} className={`folder folder-${id}`} onClick={() => openWindow(id, win.title, <win.component />, null, win.color)}>
                <div className="folder-icon" style={{ '--folder-color': win.color }} />
                <div className="folder-name">{win.label}</div>
              </div>
            ))}
            <a href="https://github.com/BenMiller0" target="_blank" rel="noopener noreferrer" className="doc-icon">
              <div className="github-icon-image" />
              <div className="folder-name">GitHub</div>
            </a>
            <a href="https://linkedin.com/in/benjamin-miller-ucsd" target="_blank" rel="noopener noreferrer" className="doc-icon">
              <div className="linkedin-icon-image" />
              <div className="folder-name">LinkedIn</div>
            </a>
          </div>
          <div className="projects-container">
            {projectChunks.map((chunk, chunkIndex) => (
              <div key={chunkIndex} className="project-row">
                {chunk.map(p => (
                  <div key={p.id} className="folder" onClick={() => openWindow(p.id, p.title, (
                    <ProjectWindowContent project={p} />
                  ))}>
                    <div className="folder-icon"></div>
                    <div className="folder-name">{p.label}</div>
                  </div>
                ))}
              </div>
            ))}
            {moreProjects.length > 0 && (
              <div className="project-row">
                <div className="folder" onClick={() => openMoreProjectsWindow()}>
                  <div className="folder-icon" />
                  <div className="folder-name">More Projects</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="resume-icons">
          <div className="doc-icon" onClick={() => openResumeViewer('/hardware_resume.pdf', 'Hardware Resume')}>
            <div className="doc-icon-image" />
            <div className="folder-name">Hardware Resume</div>
          </div>
          <div className="doc-icon" onClick={() => openResumeViewer('/software_resume.pdf', 'Software Resume')}>
            <div className="doc-icon-image" />
            <div className="folder-name">Software Resume</div>
          </div>
        </div>
      </div>

      {openWindows.map(win => (
        <Window
          key={win.id}
          id={win.id}
          title={win.title}
          onClose={() => closeWindow(win.id)}
          position={win.position}
          onDrag={updateWindowPosition}
          onFocus={() => bringToFront(win.id)}
          onBack={win.onBack}
          style={{ zIndex: win.zIndex }}
          isFullscreen={win.isFullscreen}
          onToggleFullscreen={() => toggleFullscreen(win.id)}
          headerColor={win.color}
        >
          {win.content}
        </Window>
      ))}

      <button
        className={`dark-mode-toggle ${darkMode ? 'dark' : 'light'}`}
        onClick={() => setDarkMode(!darkMode)}
      >
        <span className="toggle-icon">{darkMode ? '☀️' : '🌙'}</span>
        <span className="toggle-track"></span>
      </button>
    </>
  );
};

export default App;