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
const VADER_IDLE_DELAY_MS = 10_000;
const VADER_IDLE_JITTER_MS = 5_000;
const VADER_AUTO_PLAY_MS = 10_000;

const ProjectFolderIcon = ({ projectId }) => {
  if (projectId !== 'project3') {
    return <div className="folder-icon" />;
  }

  return (
    <div className="folder-icon folder-icon-vader" aria-hidden="true">
      <svg className="vader-figure" viewBox="0 0 80 62" focusable="false">
        <path className="vader-cape" d="M3 62 9 43c2-7 10-12 22-15h18c12 3 20 8 22 15l6 19Z" />
        <path className="vader-cape-fold" d="m10 62 7-21 12-9-7 30Zm60 0-7-21-12-9 7 30Z" />

        <path className="vader-helmet-shell" d="M20 31 24 18C24 7 31 1 40 1s16 6 16 17l4 13-8-4-2 8-6-5-2 8h-4l-2-8-6 5-2-8Z" />
        <path className="vader-dome" d="M26 19C26 8 32 3 40 3s14 5 14 16l-5-5-9-4-9 4Z" />
        <path className="vader-face" d="m27 19 5-6 8-3 8 3 5 6-3 10-6 8h-8l-6-8Z" />
        <path className="vader-cheek vader-cheek-left" d="m28 26 8-2-2 8-5-3Z" />
        <path className="vader-cheek vader-cheek-right" d="m52 26-8-2 2 8 5-3Z" />
        <path className="vader-brow" d="m28 18 10-3 2 2 2-2 10 3-2 3-8-2-2 2-2-2-8 2Z" />
        <path className="vader-eye" d="m29 20 9-2-2 5-7 1Z" />
        <path className="vader-eye" d="m51 20-9-2 2 5 7 1Z" />
        <path className="vader-nose" d="m40 18 4 11-4 4-4-4Z" />
        <path className="vader-respirator" d="m34 29 6 4 6-4 3 7-5 5h-8l-5-5Z" />
        <path className="vader-grille" d="M35 33h10M36 36h8M38 31v8m4-8v8" />
        <path className="vader-helmet-highlight" d="M31 8c3-4 8-5 12-4m-15 9-3 10" />

        <path className="vader-armor" d="M18 62V42l13-10 5 7h8l5-7 13 10v20Z" />
        <path className="vader-armor-line" d="m20 43 13-8m27 8-13-8M25 62l4-23m26 23-4-23" />

        <g className="vader-chest-box">
          <path d="m31 42 2-3h14l2 3v13H31Z" />
          <path className="vader-panel-edge" d="M33 43h14v10H33Z" />
          <rect className="vader-switch vader-switch-red" x="34.5" y="44.5" width="3" height="3" rx=".5" />
          <rect className="vader-switch vader-switch-blue" x="42.5" y="44.5" width="3" height="3" rx=".5" />
          <rect className="vader-switch vader-switch-amber" x="34.5" y="49" width="3" height="2.5" rx=".5" />
          <rect className="vader-switch vader-switch-white" x="42.5" y="49" width="3" height="2.5" rx=".5" />
          <path className="vader-panel-bars" d="M39 44.5v7m2-7v7" />
        </g>

        <g className="vader-belt-unit">
          <path className="vader-belt-strap" d="M18 55h44v6H18Z" />
          <path className="vader-belt-box" d="M20 54h10v8H20Zm30 0h10v8H50Z" />
          <path className="vader-buckle" d="M35 54h10v8H35Z" />
          <circle className="vader-belt-light vader-belt-light-red" cx="23" cy="57" r="1.2" />
          <circle className="vader-belt-light vader-belt-light-green" cx="27" cy="57" r="1.2" />
          <circle className="vader-belt-light vader-belt-light-blue" cx="53" cy="57" r="1.2" />
          <circle className="vader-belt-light vader-belt-light-amber" cx="57" cy="57" r="1.2" />
          <path className="vader-buckle-detail" d="M37 56h6v4h-6Z" />
        </g>
      </svg>
    </div>
  );
};

const ProjectFolderButton = ({ project, onClick }) => {
  const isVader = project.id === 'project3';
  const [isInteracting, setIsInteracting] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [idleCycle, setIdleCycle] = useState(0);

  useEffect(() => {
    if (!isVader || isInteracting) return undefined;

    let playTimer;
    const randomizedIdleDelay = VADER_IDLE_DELAY_MS + Math.random() * VADER_IDLE_JITTER_MS;
    const idleTimer = window.setTimeout(() => {
      setIsAutoPlaying(true);
      playTimer = window.setTimeout(() => {
        setIsAutoPlaying(false);
        setIdleCycle(cycle => cycle + 1);
      }, VADER_AUTO_PLAY_MS);
    }, randomizedIdleDelay);

    return () => {
      window.clearTimeout(idleTimer);
      window.clearTimeout(playTimer);
    };
  }, [idleCycle, isInteracting, isVader]);

  const beginInteraction = () => {
    setIsInteracting(true);
    setIsAutoPlaying(false);
  };

  return (
    <button
      type="button"
      className={`folder${isVader ? ' folder-vader' : ''}${isAutoPlaying ? ' vader-auto-playing' : ''}`}
      onClick={onClick}
      onPointerEnter={isVader ? beginInteraction : undefined}
      onPointerLeave={isVader ? () => setIsInteracting(false) : undefined}
      onFocus={isVader ? beginInteraction : undefined}
      onBlur={isVader ? () => setIsInteracting(false) : undefined}
    >
      <ProjectFolderIcon projectId={project.id} />
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
                    <ProjectFolderButton
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
          <ProjectFolderButton
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
