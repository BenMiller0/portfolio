import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './assets/styles.css';
import Window from './components/Window';
import ProjectWindowContent from './windows/ProjectWindowContent';
import { calculateRestorePosition, calculateWindowPosition, isMobileViewport } from './constants/windowLayout';
import { resumeLinks, socialLinks, systemWindows, getTerminalDesktopWindow } from './data/windowRegistry';
import { useTypewriter } from './hooks/useTypewriter';

const PROFILE_NAME = 'Benjamin Miller';
const SCHOOL_NAME = 'UC San Diego - Computer Science';

const getInitialDarkMode = () => {
  try {
    const savedTheme = window.localStorage.getItem('portfolio-theme');
    if (savedTheme === 'dark') return true;
    if (savedTheme === 'light') return false;
  } catch {
    // Storage is optional.
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
};

const isProjectRecord = project =>
  project &&
  typeof project.id === 'string' &&
  typeof project.label === 'string' &&
  typeof project.title === 'string';

const chunkItems = (items, size) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size)
  );

const createResumeWindowId = (title) => title.replace(/\s+/g, '').toLowerCase();

const App = () => {
  const [projects, setProjects] = useState([]);
  const [projectStatus, setProjectStatus] = useState('loading');
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [openWindows, setOpenWindows] = useState([]);
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);
  const [announcement, setAnnouncement] = useState('');
  const moreProjectsFullscreenRef = useRef(false);
  const { value: typedName, done: nameTyped } = useTypewriter(PROFILE_NAME, 50);
  const { value: typedSchool } = useTypewriter(SCHOOL_NAME, 40, nameTyped ? 150 : 0);

  useEffect(() => {
    let cancelled = false;
    setProjectStatus('loading');

    fetch('/projects.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (cancelled) return;
        if (!Array.isArray(data)) throw new Error('Project data is not a list');
        const validProjects = data.filter(isProjectRecord);
        setProjects(validProjects);
        setProjectStatus(validProjects.length ? 'ready' : 'empty');
      })
      .catch(err => {
        if (cancelled) return;
        console.error('Failed to load projects:', err);
        setProjectStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [loadAttempt]);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    try {
      window.localStorage.setItem('portfolio-theme', darkMode ? 'dark' : 'light');
    } catch {
      // Theme persistence is an enhancement.
    }
  }, [darkMode]);

  useEffect(() => {
    const hasFullscreen = openWindows.some(win => win.isFullscreen);
    const shouldLockPage = hasFullscreen || (isMobileViewport() && openWindows.length > 0);
    document.body.classList.toggle('fullscreen-window-open', shouldLockPage);
    document.documentElement.classList.toggle('fullscreen-window-open', shouldLockPage);
  }, [openWindows]);

  const bringToFront = useCallback((id) => {
    setOpenWindows(windows => {
      const maxZIndex = Math.max(...windows.map(win => win.zIndex), 100);
      return windows.map(win =>
        win.id === id ? { ...win, zIndex: maxZIndex + 1 } : win
      );
    });
  }, []);

  const openWindow = useCallback((id, title, content, onBack = null, color = null, options = {}) => {
    setAnnouncement(`${title} opened.`);
    setOpenWindows(windows => {
      const maxZIndex = Math.max(...windows.map(win => win.zIndex), 100);
      const windowExists = windows.some(win => win.id === id);

      if (windowExists) {
        return windows.map(win =>
          win.id === id ? { ...win, zIndex: maxZIndex + 1 } : win
        );
      }

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
  }, []);

  const closeWindow = useCallback((id) => {
    if (id === 'moreProjects') {
      moreProjectsFullscreenRef.current = false;
    }
    setAnnouncement('Window closed.');
    setOpenWindows(windows => windows.filter(win => win.id !== id));
  }, []);

  const updateWindowPosition = useCallback((id, newPosition) => {
    setOpenWindows(windows => windows.map(win =>
      win.id === id ? { ...win, position: newPosition } : win
    ));
  }, []);

  const toggleFullscreen = useCallback((id) => {
    setAnnouncement('Window size changed.');
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

  useEffect(() => {
    const handleEscape = event => {
      if (event.key !== 'Escape' || openWindows.length === 0) return;
      const frontWindow = openWindows.reduce((front, win) =>
        win.zIndex > front.zIndex ? win : front
      );
      closeWindow(frontWindow.id);
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [closeWindow, openWindows]);

  const mainProjects = projects.slice(0, 3);
  const moreProjects = projects.slice(3);
  const projectChunks = useMemo(() => chunkItems(mainProjects, 3), [mainProjects]);
  const terminalDesktopWindow = useMemo(() => getTerminalDesktopWindow(projects), [projects]);

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
      <div className="desktop-background">
        <div className="triton-logo"></div>
        <div className="crosshair-horizontal"></div>
        <div className="crosshair-vertical"></div>
      </div>
      <div className="name-display">{typedName}</div>
      {nameTyped && <div className="school-display">{typedSchool}</div>}

      <div className="desktop">
        <div className="main-icons-container">
          <div className="system-icons">
            {Object.entries(systemWindows).map(([id, win]) => {
              const openSystemWindow = () => openWindow(id, win.title, <win.component />, null, win.color);

              return (
                <button
                  type="button"
                  key={id}
                  className={`doc-icon text-file-icon text-file-${id}`}
                  onClick={openSystemWindow}
                >
                  <div className="text-file-icon-image" />
                  <div className="folder-name" data-mobile-label={win.title}>{win.label}</div>
                </button>
              );
            })}
            <button
              type="button"
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
            </button>
            {socialLinks.map(link => (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                referrerPolicy="no-referrer"
                className={`doc-icon social-doc-icon social-${link.id}`}
              >
                <div className={link.iconClassName} />
                <div className="folder-name">{link.label}</div>
              </a>
            ))}
          </div>

          <div className="projects-container">
            {projectStatus === 'loading' && [1, 2, 3].map(index => (
              <div key={index} className="folder folder-loading" aria-hidden="true">
                <div className="folder-icon"></div>
                <div className="folder-name">&nbsp;</div>
              </div>
            ))}
            {projectStatus === 'error' && (
              <button
                type="button"
                className="doc-icon project-state-icon project-error-icon"
                onClick={() => setLoadAttempt(attempt => attempt + 1)}
                aria-label="Retry loading projects"
              >
                <div className="text-file-icon-image" />
                <div className="folder-name">projects_error.txt</div>
              </button>
            )}
            {projectStatus === 'empty' && (
              <div className="doc-icon project-state-icon" aria-label="No projects available">
                <div className="text-file-icon-image" />
                <div className="folder-name">projects_empty.txt</div>
              </div>
            )}
            {projectChunks.map((chunk, chunkIndex) => (
              <div key={chunkIndex} className="project-row">
                {chunk.map(project => {
                  const openProject = () => openWindow(
                    project.id,
                    project.title,
                    <ProjectWindowContent project={project} />
                  );

                  return (
                    <button
                      type="button"
                      key={project.id}
                      className="folder"
                      onClick={openProject}
                    >
                      <div className="folder-icon"></div>
                      <div className="folder-name">{project.label}</div>
                    </button>
                  );
                })}
              </div>
            ))}
            {moreProjects.length > 0 && (
              <div className="project-row">
                <button
                  type="button"
                  className="folder"
                  onClick={() => openMoreProjectsWindow()}
                >
                  <div className="folder-icon" />
                  <div className="folder-name">More Projects</div>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="resume-icons">
          {resumeLinks.map(resume => {
            const openResume = () => openResumeViewer(resume.path, resume.title);

            return (
              <button
                type="button"
                key={resume.id}
                className="doc-icon"
                onClick={openResume}
              >
                <div className="doc-icon-image" />
                <div className="folder-name" data-mobile-label={resume.title}>{resume.label}</div>
              </button>
            );
          })}
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
        <span className="toggle-icon" aria-hidden="true">{darkMode ? '☀' : '☾'}</span>
        <span className="toggle-track"></span>
      </button>
      <div className="sr-only" aria-live="polite">{announcement}</div>
    </>
  );
};

const MoreProjectsContent = ({ projects, openProjectWindow, reopenMoreProjects, closeMoreProjects, moreProjectsFullscreenRef }) => (
  <div className="more-projects-window">
    <h2>More Projects</h2>
    <div className="more-projects-grid">
      {projects.map(project => {
        const openProject = (event) => {
          event?.stopPropagation();
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
        };

        return (
          <button
            type="button"
            key={project.id}
            className="folder"
            onClick={openProject}
          >
            <div className="folder-icon"></div>
            <div className="folder-name">{project.label}</div>
          </button>
        );
      })}
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
