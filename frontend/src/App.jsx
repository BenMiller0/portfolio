import React, { useState, useEffect, useRef } from 'react';
import './assets/styles.css';

const windowsInfo = {
  aboutWindow: {
    title: 'About Me',
    label: 'About me',
    color: 'lightgreen',
    content: (
      <>
        <h2>About Me</h2>
        As a third-year Computer Science student at UC San Diego (GPA 3.8), I have experience in embedded systems, AI/ML, and full-stack development. I’ve built real-time hardware control systems, machine learning systems, and full-stack apps, combining hardware integration with software engineering to deliver interdisciplinary solutions.
        <h3>Skills</h3>
        <p><b>Programming Languages:</b> C, C++, ARM Assembly, System Verilog, Python, MATLAB, Java, JavaScript, TypeScript</p>
        <p><b>Embedded Systems:</b> FreeRTOS, I2C, PWM, GPIO, ESP32, Servos, Raspberry Pi</p>
        <p><b>Web Development:</b> Flask, FastAPI, React, Node.js, REST APIs, Tailwind CSS, HTML, Vite, Express</p>
        <p><b>Machine Learning:</b> NumPy, PyTorch, Pandas, scikit-learn, OpenCV</p>
        <p><b>Tools & DevOps:</b> Linux, Git, Docker, CI/CD, Bash, Agile/Scrum, Virtual Machines</p>
      </>
    )
  },
  aboutSiteWindow: {
    title: 'README',
    label: 'README',
    color: '#f2f2f2',
    content: (
      <>
        <h2>README</h2>
        <p>This portfolio is designed to look and feel like a desktop environment, showcasing projects in embedded systems, AI/ML, and web development.</p>
        <p>Click on folders to open project windows, and drag them around like real windows. Use the fullscreen button to expand windows.</p>
        <p><b>Tech Stack:</b> React 19, Vite, Custom CSS with dark mode, JSON-based project configuration, Font Awesome icons</p>
        <p>Inspired by the simplicity and nostalgia of old OS interfaces.</p>
      </>
    )
  },
  experienceWindow: {
    title: 'Experience',
    label: 'Experience',
    color: 'orange',
    content: (
      <div className="space-y-6 p-4">
        <div>
          <h3 className="font-bold">Software Engineering Lead & VP, Themed Entertainment Association at UCSD</h3>
          <p className="text-sm text-gray-500">Jun. 2024 – Present</p>
          <ul className="list-disc list-inside ml-4">
            <p> - Led software development including launching the association’s website (JavaScript, CI/CD) and themed attraction production software (Python, C, C++), enabling reliable themed attraction operations.</p>
            <p> - Organized and represented UCSD in national engineering team competitions, coordinating interdisciplinary collaboration and ensuring effective teamwork.</p>
          </ul>
        </div>
        <div>
          <h3 className="font-bold">Software Engineering Intern, Western Digital</h3>
          <p className="text-sm text-gray-500">Sep. 2025 – Dec. 2025</p>
          <ul className="list-disc list-inside ml-4">
            <p> - Improved hard drive firmware reliability and infrastructure via developing and testing embedded C++ features, validated through higher code quality.</p>
            <p> - Developed internal tool for accelerating integration testing via a Python microservice and full stack application (Flask, SQLite, Javascript), as seen by successful end to end demonstrations to management. </p>
          </ul>
        </div>
        <div>
          <h3 className="font-bold">Software Developer Intern, Center for Applied Internet Data Analysis</h3>
          <p className="text-sm text-gray-500">Apr. 2025 – Aug. 2025</p>
          <ul className="list-disc list-inside ml-4">
            <p> - Enhanced website usability by developing and maintaining JavaScript and Python scripts, streamlining content management workflows.</p>
            <p> - Maintained a website with 2,000+ daily visitors, ensuring reliability and performance with Git-based collaborative version control.</p>
          </ul>
        </div>
        <div>
          <h3 className="font-bold">Resident Advisor, COSMOS UC San Diego</h3>
          <p className="text-sm text-gray-500">Jul. 2024 – Aug. 2024</p>
          <ul className="list-disc list-inside ml-4">
            <p> - Provided guidance and mentorship for the Video Game Programming and Game AI Design group, empowering students through personalized support and advice.</p>
          </ul>
        </div>
      </div>
    )
  }
};

const Window = ({ id, title, children, onClose, position, onDrag, onFocus, style, onBack, isFullscreen, onToggleFullscreen }) => {
  const windowRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const currentZIndex = useRef(style.zIndex || 100);

  // Apply initial z-index when component mounts
  useEffect(() => {
    if (windowRef.current) {
      windowRef.current.style.zIndex = currentZIndex.current;
    }
  }, []);

  const bringToFrontImmediate = () => {
    if (windowRef.current) {
      // Find the highest z-index among all windows
      const windows = document.querySelectorAll('.window');
      const highestZ = Math.max(...Array.from(windows).map(w => parseInt(w.style.zIndex || 0)));
      const newZIndex = highestZ + 1;
      
      // Set z-index directly on DOM element
      windowRef.current.style.zIndex = newZIndex;
      currentZIndex.current = newZIndex;
      
      // Update React state without triggering re-render that would override
      if (onFocus) {
        onFocus();
      }
    }
  };

  const startDrag = (clientX, clientY) => {
    if (!windowRef.current) return;
    const rect = windowRef.current.getBoundingClientRect();
    offset.current = { x: clientX - rect.left, y: clientY - rect.top };
    isDragging.current = true;
  };

  const moveDrag = (clientX, clientY) => {
    if (!isDragging.current) return;
    onDrag(id, { x: clientX - offset.current.x, y: clientY - offset.current.y });
  };

  const stopDrag = () => { isDragging.current = false; };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    if (isFullscreen) return;
    bringToFrontImmediate();
    startDrag(e.clientX, e.clientY);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => moveDrag(e.clientX, e.clientY);
  const handleMouseUp = () => {
    stopDrag();
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e) => {
    if (isFullscreen) return;
    bringToFrontImmediate();
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    moveDrag(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    stopDrag();
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };

  return (
    <div
      ref={windowRef}
      className={`window ${isFullscreen ? 'fullscreen' : ''}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          bringToFrontImmediate();
        }
      }}
      style={isFullscreen ? {} : { 
        left: `${position.x}px`, 
        top: `${position.y}px`, 
        position: 'absolute'
      }}
    >
      <div className="window-header">
        {onBack && <button className="back-button" onClick={(e) => { e.stopPropagation(); onClose(); onBack(); }} onTouchEnd={(e) => e.stopPropagation()}>← Back</button>}
        <span>{title}</span>
        <div className="window-controls">
          <button className="fullscreen-button" onClick={(e) => { e.stopPropagation(); onToggleFullscreen && onToggleFullscreen(); }} onTouchEnd={(e) => e.stopPropagation()}>
            {isFullscreen ? '⤢' : '⛶'}
          </button>
          <button className="close-button" onClick={(e) => { e.stopPropagation(); onClose(); }} onTouchEnd={(e) => e.stopPropagation()}>&times;</button>
        </div>
      </div>
      <div className="window-content" onClick={(e) => {
        if (e.target === e.currentTarget) {
          bringToFrontImmediate();
        }
      }}>
        {children}
      </div>
    </div>
  );
};

const ProjectWindowContent = ({ project }) => {
  const sizeStyles = {
    small: { maxWidth: '100px', height: 'auto' },
    medium: { maxWidth: '300px', height: 'auto' },
    large: { maxWidth: '400px', height: 'auto' },
    xlarge: { maxWidth: '500px', height: 'auto' }
  };

  const currentSize = project.imageSize || 'medium';

  const renderBulletPoints = (description) => {
    if (!description) return null;
    const lines = description.split('\n');
    return (
      <ul>
        {lines.map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <h2>{project.title}</h2>
      {renderBulletPoints(project.description)}
      <h3>Technologies Used:</h3>
      <p>{project.technologies}</p>
      
      {project.photos && project.photos.length > 0 && (
        <>
          <h3>Project Photos:</h3>
          <div className="photo-gallery" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {project.photos.map((photo, index) => (
              <img 
                key={index}
                src={`/project_photos/${photo}`}
                alt={`${project.title} - Photo ${index + 1}`}
                className="project-photo"
                style={{ 
                  ...sizeStyles[currentSize],
                  borderRadius: '8px',
                  border: '2px solid #ccc',
                  flex: '1 1 auto',
                  minWidth: '200px'
                }}
              />
            ))}
          </div>
        </>
      )}
      
      {project.miscLink && project.miscLink.displayName && project.miscLink.url && (
        <h3>
          <a href={project.miscLink.url} target="_blank" rel="noopener noreferrer">
            {project.miscLink.displayName}
          </a>
        </h3>
      )}
      
      {project.github && <h3><a href={project.github} target="_blank" rel="noopener noreferrer">GitHub</a></h3>}
    </>
  );
};

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

  const openWindow = (id, title, content, onBack = null) => {
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
        startY = (window.innerHeight - estimatedHeight) / 2 + (openWindows.length * 30);
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
          isFullscreen: false
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
            <div key={p.id} className="folder" onClick={() => openWindow(p.id, p.title, (
              <ProjectWindowContent project={p} />
            ), () => openMoreProjectsWindow())}>
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
  
  const updateWindowPosition = (id, newPos) => {
    setOpenWindows(openWindows.map(win => win.id === id ? { ...win, position: newPos } : win));
  };

  const bringToFront = (id) => {
    setZIndexCounter(prev => {
      const newZIndex = prev + 1;
      setOpenWindows(windows => windows.map(win => win.id === id ? { ...win, zIndex: newZIndex } : win));
      return newZIndex;
    });
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
              <div key={id} className={`folder folder-${id}`} onClick={() => openWindow(id, win.title, win.content)}>
                <div className="folder-icon" style={{ background: win.color }} />
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
          <a href="/hardware_resume.pdf" download className="doc-icon">
            <div className="doc-icon-image" />
            <div className="folder-name">Hardware Resume</div>
          </a>
          <a href="/software_resume.pdf" download className="doc-icon">
            <div className="doc-icon-image" />
            <div className="folder-name">Software Resume</div>
          </a>
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