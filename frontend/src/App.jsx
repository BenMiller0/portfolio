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
        I am a third year computer science student at UC San Diego with a 3.8 GPA. I have gained experience across embedded systems, machine learning, and full-stack development.
        My background combines hands-on hardware integration with software engineering, allowing me to contribute effectively to interdisciplinary projects that bridge physical systems and intelligent software solutions.
        <h3>Skills</h3>
        <p><b>Programming Languages:</b> C/C++, ARM Assembly, System Verilog, Python, MATLAB, Java, JavaScript, TypeScript</p>
        <p><b>Hardware:</b> ESP 32, Raspberry Pi, sensors (e.g., accelerometers, gyroscopes), motors, camera modules</p>
        <p><b>Web Development:</b> jQuery, Hugo, Node.js, React, CSS, HTML, REST APIs, Vite, Express</p>
        <p><b>Machine Learning:</b> PyTorch, NumPy, Computer Vision, Pandas</p>
        <p><b>Operating Systems:</b> Linux, macOS, Windows</p>
      </>
    )
  },
  aboutSiteWindow: {
    title: 'ReadMe.txt',
    label: 'ReadMe.txt',
    color: '#f2f2f2',
    content: (
      <>
        <h2>README</h2>
        <p>This portfolio is designed to look and feel like a desktop environment.</p>
        <p>Click on folders to open project windows, and drag them around like real windows.</p>
        <p>Technologies used include React, CSS, Vite, and JSON for data-driven UI generation.</p>
        <p>All projects are dynamically loaded from a JSON file in <code>public/projects.json</code>.</p>
        <p>Inspired by the simplicity and nostalgia of old OS interfaces.</p>
      </>
    )
  }
};



const Window = ({ id, title, children, onClose, position, onDrag }) => {
  const windowRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    if (!windowRef.current) return;

    const rect = windowRef.current.getBoundingClientRect();
    offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    isDragging.current = true;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    onDrag(id, { x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={windowRef}
      className="window"
      style={{ left: `${position.x}px`, top: `${position.y}px`, position: 'absolute' }}
    >
      <div className="window-header" onMouseDown={handleMouseDown}>
        <span>{title}</span>
        <button className="close-button" onClick={onClose}>&times;</button>
      </div>
      <div className="window-content">{children}</div>
    </div>
  );
};

const App = () => {
  const [projects, setProjects] = useState([]);
  const [openWindows, setOpenWindows] = useState([]);
  const [zIndexCounter, setZIndexCounter] = useState(10);

  useEffect(() => {
    fetch('/projects.json')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error('Failed to load projects:', err));
  }, []);

  const openWindow = (id, title, content) => {
    const existingIndex = openWindows.findIndex(win => win.id === id);

    if (existingIndex === -1) {
      setOpenWindows([
        ...openWindows,
        {
          id,
          title,
          content,
          position: {
            x: 100 + (openWindows.length * 30) % 500,
            y: 100 + (openWindows.length * 30) % 300,
          },
          zIndex: zIndexCounter,
        }
      ]);
      setZIndexCounter(zIndexCounter + 1);
    } else {
      bringToFront(id);
    }
  };

  const closeWindow = (id) => {
    setOpenWindows(openWindows.filter(win => win.id !== id));
  };

  const updateWindowPosition = (id, position) => {
    setOpenWindows(openWindows.map(win => win.id === id ? { ...win, position } : win));
  };

  const bringToFront = (id) => {
    setOpenWindows(openWindows.map(win => win.id === id ? { ...win, zIndex: zIndexCounter } : win));
    setZIndexCounter(zIndexCounter + 1);
  };

  return (
    <div className="desktop-background">
      {openWindows.map(win => (
        <Window
          key={win.id}
          id={win.id}
          title={win.title}
          onClose={() => closeWindow(win.id)}
          position={win.position}
          onDrag={updateWindowPosition}
          style={{ zIndex: win.zIndex }}
        >
          {win.content}
        </Window>
      ))}

      <div className="name-display">Benjamin Miller</div>
      <div className="school-display">UC San Diego - Computer Science</div>

      <div className="desktop">
        <div className="icons-container">
          {projects.map(p => (
            <div
              key={p.id}
              className="folder"
              onClick={() => openWindow(p.id, p.title, (
                <>
                  <h2>{p.title}</h2>
                  <p>{p.description}</p>
                  <h3>Technologies Used:</h3>
                  <p>{p.technologies}</p>
                  {p.github && (
                    <h3>
                      <a href={p.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                    </h3>
                  )}
                </>
              ))}
            >
              <div className="folder-icon" />
              <div className="folder-name">{p.label}</div>
            </div>
          ))}

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

          {Object.entries(windowsInfo).map(([id, win]) => (
            <div
              key={id}
              className="folder"
              onClick={() => openWindow(id, win.title, win.content)}
            >
              <div className="folder-icon" style={{ background: win.color }} />
              <div className="folder-name">{win.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
