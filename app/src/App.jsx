import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './assets/styles.css';
import ProjectIcon from './components/ProjectIcon';
import DesktopIcon from './components/DesktopIcon';
import Window from './components/Window';
import ProjectWindowContent from './windows/ProjectWindowContent';
import { calculateRestorePosition, calculateWindowPosition, isMobileViewport } from './constants/windowLayout';
import { resumeLinks, socialLinks, systemWindows, getTerminalDesktopWindow } from './data/windowRegistry';
import { useTypewriter } from './hooks/useTypewriter';
import { useMobileViewport } from './hooks/useMobileViewport';

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
const MAIN_PROJECT_IDS = ['project1', 'project3', 'project4'];

const ProjectIconButton = ({ project, onClick }) => {
  return (
    <button
      type="button"
      className={`folder project-icon-button project-icon-button-${project.id}`}
      onClick={onClick}
    >
      <ProjectIcon projectId={project.id} />
      <div className="folder-name">{project.label}</div>
    </button>
  );
};

const App = () => {
  const [projects, setProjects] = useState([]);
  const [projectStatus, setProjectStatus] = useState('loading');
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [openWindows, setOpenWindows] = useState([]);
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);
  const [announcement, setAnnouncement] = useState('');
  const isMobile = useMobileViewport();
  const moreProjectsFullscreenRef = useRef(false);
  const moreProjectsLauncherRef = useRef(null);
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
    const shouldLockPage = hasFullscreen || (isMobile && openWindows.length > 0);
    document.body.classList.toggle('fullscreen-window-open', shouldLockPage);
    document.documentElement.classList.toggle('fullscreen-window-open', shouldLockPage);
  }, [isMobile, openWindows]);

  const bringToFront = useCallback((id) => {
    setOpenWindows(windows => {
      const maxZIndex = Math.max(...windows.map(win => win.zIndex), 100);
      return windows.map(win =>
        win.id === id ? { ...win, zIndex: maxZIndex + 1 } : win
      );
    });
  }, []);

  const openWindow = useCallback((id, title, content, onBack = null, color = null, options = {}) => {
    const returnFocus = options.returnFocus ?? document.activeElement;
    const existingWindow = Array.from(document.querySelectorAll('[data-window-id]'))
      .find(node => node.dataset.windowId === id);
    existingWindow?.focus({ preventScroll: true });
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
          color,
          returnFocus
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

  const mainProjects = useMemo(() => MAIN_PROJECT_IDS
    .map(id => projects.find(project => project.id === id))
    .filter(Boolean), [projects]);
  const moreProjects = useMemo(() => projects
    .filter(project => !MAIN_PROJECT_IDS.includes(project.id)), [projects]);
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
        moreProjectsLauncherRef={moreProjectsLauncherRef}
      />,
      null,
      null,
      {
        isFullscreen: preserveFullscreen && moreProjectsFullscreenRef.current,
        returnFocus: moreProjectsLauncherRef.current
      }
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
                  <DesktopIcon kind={id} />
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
              <DesktopIcon kind="terminal" />
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
                <DesktopIcon kind={link.id} />
                <div className="folder-name">{link.label}</div>
              </a>
            ))}
          </div>

          <div className="projects-container">
            {projectStatus === 'loading' && MAIN_PROJECT_IDS.map(projectId => (
              <div key={projectId} className="folder folder-loading" aria-hidden="true">
                <div className="project-visual project-visual-loading" />
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
                <DesktopIcon kind="status" />
                <div className="folder-name">projects_error.txt</div>
              </button>
            )}
            {projectStatus === 'empty' && (
              <div className="doc-icon project-state-icon" aria-label="No projects available">
                <DesktopIcon kind="status" />
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
                    <ProjectIconButton
                      key={project.id}
                      project={project}
                      onClick={openProject}
                    />
                  );
                })}
              </div>
            ))}
            {moreProjects.length > 0 && (
              <div className="project-row">
                <button
                  type="button"
                  className="folder"
                  ref={moreProjectsLauncherRef}
                  onClick={() => openMoreProjectsWindow()}
                >
                  <DesktopIcon kind="projects" />
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
                <DesktopIcon kind={resume.id} />
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
          returnFocus={win.returnFocus}
        >
          {win.content}
        </Window>
      ))}

      <button
        className={`dark-mode-toggle ${darkMode ? 'dark' : 'light'}`}
        onClick={() => setDarkMode(current => !current)}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <span className="toggle-icon" aria-hidden="true">
          {darkMode ? (
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
            </svg>
          )}
        </span>
        <span className="toggle-track"></span>
      </button>
      <div className="sr-only" aria-live="polite">{announcement}</div>
    </>
  );
};

const MoreProjectsContent = ({ projects, openProjectWindow, reopenMoreProjects, closeMoreProjects, moreProjectsFullscreenRef, moreProjectsLauncherRef }) => (
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
              const projectWindow = Array.from(document.querySelectorAll('.window'))
                .find(node => node.dataset.windowId === project.id);
              moreProjectsFullscreenRef.current = projectWindow?.classList.contains('fullscreen') ?? false;
              reopenMoreProjects(true);
            },
            null,
            { isFullscreen: wasFullscreen, returnFocus: moreProjectsLauncherRef.current }
          );
          closeMoreProjects();
        };

        return (
          <ProjectIconButton
            key={project.id}
            project={project}
            onClick={openProject}
          />
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
