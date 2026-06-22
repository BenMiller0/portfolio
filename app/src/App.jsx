import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './assets/styles.css';
import Window from './components/Window';
import ProjectWindowContent from './windows/ProjectWindowContent';
import { calculateRestorePosition, calculateWindowPosition, isMobileViewport } from './constants/windowLayout';
import { resumeLinks, socialLinks, systemWindows, terminalDesktopWindow } from './data/windowRegistry';
import { useTypewriter } from './hooks/useTypewriter';

const PROFILE_NAME = 'Benjamin Miller';
const SCHOOL_NAME = 'UC San Diego - Computer Science';

const chunkItems = (items, size) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size)
  );

const createResumeWindowId = (title) => title.replace(/\s+/g, '').toLowerCase();

const App = () => {
  const [projects, setProjects] = useState([]);
  const [openWindows, setOpenWindows] = useState([]);
  const [zIndexCounter, setZIndexCounter] = useState(100);
  const [darkMode, setDarkMode] = useState(false);
  const moreProjectsFullscreenRef = useRef(false);
  const { value: typedName, done: nameTyped } = useTypewriter(PROFILE_NAME, 50);
  const { value: typedSchool } = useTypewriter(SCHOOL_NAME, 40, nameTyped ? 150 : 0);

  useEffect(() => {
    let cancelled = false;

    fetch('/projects.json')
      .then(res => res.json())
      .then(data => {
        if (!cancelled) setProjects(data);
      })
      .catch(err => console.error('Failed to load projects:', err));

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const hasFullscreen = openWindows.some(win => win.isFullscreen);
    document.body.classList.toggle('fullscreen-window-open', hasFullscreen);
    document.documentElement.classList.toggle('fullscreen-window-open', hasFullscreen);
  }, [openWindows]);

  const bringToFront = useCallback((id) => {
    setOpenWindows(windows => {
      const maxZIndex = Math.max(...windows.map(win => win.zIndex), 100);
      return windows.map(win =>
        win.id === id ? { ...win, zIndex: maxZIndex + 1 } : win
      );
    });
    setZIndexCounter(current => Math.max(current, Math.max(...openWindows.map(win => win.zIndex), 100) + 1));
  }, [openWindows]);

  const openWindow = useCallback((id, title, content, onBack = null, color = null, options = {}) => {
    const windowExists = openWindows.some(win => win.id === id);

    if (windowExists) {
      bringToFront(id);
      return;
    }

    setOpenWindows(windows => {
      const maxZIndex = Math.max(...windows.map(win => win.zIndex), 100);
      return [
        ...windows,
        {
          id,
          title,
          content,
          position: options.position ?? calculateWindowPosition(windows.length, options.isFullscreen),
          zIndex: maxZIndex + 1,
          onBack,
          isFullscreen: options.isFullscreen ?? false,
          color
        }
      ];
    });
    setZIndexCounter(current => Math.max(current, Math.max(...openWindows.map(win => win.zIndex), 100) + 1));
  }, [bringToFront, openWindows]);

  const closeWindow = useCallback((id) => {
    if (id === 'moreProjects') {
      moreProjectsFullscreenRef.current = false;
    }
    setOpenWindows(windows => windows.filter(win => win.id !== id));
  }, []);

  const updateWindowPosition = useCallback((id, newPosition) => {
    setOpenWindows(windows => windows.map(win =>
      win.id === id ? { ...win, position: newPosition } : win
    ));
  }, []);

  const toggleFullscreen = useCallback((id) => {
    setOpenWindows(windows => {
      const updated = windows.map(win => {
        if (win.id !== id) return win;

        const isFullscreen = !win.isFullscreen;
        if (id === 'moreProjects') {
          moreProjectsFullscreenRef.current = isFullscreen;
        }
        return {
          ...win,
          isFullscreen,
          position: isFullscreen ? { x: 0, y: 0 } : calculateRestorePosition()
        };
      });
      return updated;
    });
  }, []);

  const mainProjects = projects.slice(0, 3);
  const moreProjects = projects.slice(3);
  const projectChunks = useMemo(() => chunkItems(mainProjects, 3), [mainProjects]);

  const openMoreProjectsWindow = useCallback((preserveFullscreen = false) => {
    openWindow(
      'moreProjects',
      'More Projects',
      <MoreProjectsContent
        projects={moreProjects}
        openProjectWindow={openWindow}
        reopenMoreProjects={openMoreProjectsWindow}
        closeMoreProjects={() => closeWindow('moreProjects')}
        moreProjectsFullscreenRef={moreProjectsFullscreenRef}
      />,
      null,
      null,
      preserveFullscreen ? { isFullscreen: moreProjectsFullscreenRef.current } : { isFullscreen: false }
    );
  }, [moreProjects, openWindow, closeWindow]);

  const openResumeViewer = useCallback((pdfPath, title) => {
    openWindow(
      createResumeWindowId(title),
      title,
      <ResumeViewerContent pdfPath={pdfPath} title={title} />,
      null,
      '#cc3333',
      { isFullscreen: true, position: { x: 0, y: 0 } }
    );
  }, [openWindow]);

  return (
    <>
      <div className="desktop-background"><div className="triton-logo"></div></div>
      <div className="name-display">{typedName}</div>
      {nameTyped && <div className="school-display">{typedSchool}</div>}

      <div className="desktop">
        <div className="main-icons-container">
          <div className="system-icons">
            {Object.entries(systemWindows).map(([id, win]) => (
              <div
                key={id}
                className={`doc-icon text-file-icon text-file-${id}`}
                onClick={() => openWindow(id, win.title, <win.component />, null, win.color)}
              >
                <div className="text-file-icon-image" />
                <div className="folder-name">{win.label}</div>
              </div>
            ))}
            <div
              className="doc-icon terminal-doc-icon"
              onClick={() => openWindow(
                'terminal',
                'Terminal',
                <terminalDesktopWindow.component />,
                null,
                terminalDesktopWindow.color
              )}
            >
              <div className="terminal-icon-image" />
              <div className="folder-name">Terminal</div>
            </div>
            {socialLinks.map(link => (
              <a key={link.id} href={link.href} target="_blank" rel="noopener noreferrer" className="doc-icon">
                <div className={link.iconClassName} />
                <div className="folder-name">{link.label}</div>
              </a>
            ))}
          </div>

          <div className="projects-container">
            {projectChunks.map((chunk, chunkIndex) => (
              <div key={chunkIndex} className="project-row">
                {chunk.map(project => (
                  <div
                    key={project.id}
                    className="folder"
                    onClick={() => openWindow(
                      project.id,
                      project.title,
                      <ProjectWindowContent project={project} />
                    )}
                  >
                    <div className="folder-icon"></div>
                    <div className="folder-name">{project.label}</div>
                  </div>
                ))}
              </div>
            ))}
            {moreProjects.length > 0 && (
              <div className="project-row">
                <div className="folder" onClick={openMoreProjectsWindow}>
                  <div className="folder-icon" />
                  <div className="folder-name">More Projects</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="resume-icons">
          {resumeLinks.map(resume => (
            <div key={resume.id} className="doc-icon" onClick={() => openResumeViewer(resume.path, resume.title)}>
              <div className="doc-icon-image" />
              <div className="folder-name">{resume.label}</div>
            </div>
          ))}
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
        onClick={() => setDarkMode(current => !current)}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <span className="toggle-icon"><i className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i></span>
        <span className="toggle-track"></span>
      </button>
    </>
  );
};

const MoreProjectsContent = ({ projects, openProjectWindow, reopenMoreProjects, closeMoreProjects, moreProjectsFullscreenRef }) => (
  <div className="more-projects-window">
    <h2>More Projects</h2>
    <div className="more-projects-grid">
      {projects.map(project => (
        <div
          key={project.id}
          className="folder"
          onClick={(event) => {
            event.stopPropagation();
            const wasFullscreen = moreProjectsFullscreenRef.current;
            openProjectWindow(
              project.id,
              project.title,
              <ProjectWindowContent project={project} />,
              () => {
                const projectWindow = document.querySelector('.window.fullscreen');
                const isProjectFullscreen = projectWindow !== null;
                if (isProjectFullscreen) {
                  moreProjectsFullscreenRef.current = true;
                }
                reopenMoreProjects(true);
              },
              null,
              { isFullscreen: wasFullscreen }
            );
            setTimeout(() => closeMoreProjects(), 50);
          }}
        >
          <div className="folder-icon"></div>
          <div className="folder-name">{project.label}</div>
        </div>
      ))}
    </div>
  </div>
);

const ResumeViewerContent = ({ pdfPath, title }) => (
  <div className="resume-viewer">
    <h2>{title}</h2>
    {isMobileViewport() && <p>If the PDF does not display below, please use the download button.</p>}
    <iframe
      src={pdfPath}
      className="resume-iframe"
      title={`${title} Viewer`}
    />
    <a href={pdfPath} download className="resume-download-btn">
      Download Resume
    </a>
  </div>
);

export default App;
