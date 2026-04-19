import React, { useState, useEffect } from 'react';
import './assets/styles.css';
import Window from './components/Window';
import ProjectWindowContent from './components/ProjectWindowContent';
import { windowsInfo } from './data/windowsInfo.jsx';

const App = () => {
  const [projects, setProjects] = useState([]);
  const [openWindows, setOpenWindows] = useState([]);
  const [zIndexCounter, setZIndexCounter] = useState(100);
  const [darkMode, setDarkMode] = useState(false);

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
      const isMobile = window.innerWidth < 768;
      let startX, startY;

      if (isMobile) {
        // Mobile Center Calculation
        const estimatedWidth = Math.min(window.innerWidth * 0.90, 500);
        startX = (window.innerWidth - estimatedWidth) / 2 + (openWindows.length * 30);
        // Start lower down so it doesn't overlap header, and stagger slightly
        startY = 140 + (openWindows.length * 30);
      } else {
        // Desktop Center Calculation
        const estimatedWidth = Math.min(window.innerWidth * 0.60, 600);
        const estimatedHeight = Math.min(window.innerHeight * 0.70, 500);
        startX = (window.innerWidth - estimatedWidth) / 2 + (openWindows.length * 30);
        startY = 80 + (openWindows.length * 30);
      }

      setOpenWindows([
        ...openWindows,
        {
          id,
          title,
          content,
          position: { x: Math.max(0, startX), y: Math.max(50, startY) },
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

  const openMoreProjectsWindow = () => {
    const moreProjectsContent = (
      <div className="more-projects-window">
        <h2>More Projects</h2>
        <div className="more-projects-grid">
          {moreProjects.map(p => (
            <div key={p.id} className="folder" onClick={(e) => { 
              e.stopPropagation(); 
              openWindow(p.id, p.title, (
                <ProjectWindowContent project={p} />
              ), () => openMoreProjectsWindow()); 
            }}>
              <div className="folder-icon"></div>
              <div className="folder-name">{p.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
    openWindow('moreProjects', 'More Projects', moreProjectsContent);
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
          const isMobile = window.innerWidth < 768;
          let startX, startY;
          if (isMobile) {
            const estimatedWidth = Math.min(window.innerWidth * 0.90, 500);
            startX = (window.innerWidth - estimatedWidth) / 2;
            startY = 140;
          } else {
            const estimatedWidth = Math.min(window.innerWidth * 0.60, 600);
            const estimatedHeight = Math.min(window.innerHeight * 0.70, 500);
            startX = (window.innerWidth - estimatedWidth) / 2;
            startY = (window.innerHeight - estimatedHeight) / 2;
          }
          return { ...win, isFullscreen: false, position: { x: Math.max(0, startX), y: Math.max(50, startY) } };
        }
      }
      return win;
    }));
  };

  const openResumeViewer = (pdfPath, title) => {
    const windowId = title.replace(/\s+/g, '').toLowerCase();
    const isMobile = window.innerWidth < 768;
    const resumeContent = (
      <div className="resume-viewer">
        <h2>{title}</h2>
        {isMobile && <p>If the PDF doesn't display below, please use the download button.</p>}
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
    const existingIndex = openWindows.findIndex(win => win.id === windowId);
    if (existingIndex === -1) {
      setOpenWindows([
        ...openWindows,
        {
          id: windowId,
          title,
          content: resumeContent,
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

  const chunkProjects = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size));
  const mainProjects = projects.slice(0, 3);
  const moreProjects = projects.slice(3);
  const projectChunks = chunkProjects(mainProjects, 3);
  const moreProjectsChunks = chunkProjects(moreProjects, 3);

  return (
    <>
      <div className="desktop-background"><div className="triton-logo"></div></div>
      <div className="name-display">Benjamin Miller</div>
      <div className="school-display">UC San Diego - Computer Science</div>

      <div className="desktop">
        <div className="main-icons-container">
          <div className="system-icons">
            {Object.entries(windowsInfo).map(([id, win]) => (
              <div key={id} className={`folder folder-${id}`} onClick={() => openWindow(id, win.title, win.content, null, win.color)}>
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