import React, { useState, useRef } from 'react';
import './styles.css';

const projects = [
  { id: 'project1', label: 'AI Gesture Control Python', title: 'AI Camera-Based Gesture Response System in Python', 
    description: 'Accomplished responsive gesture-controlled actuation on a Raspberry Pi AI camera...', 
    technologies: 'Python, PyTorch, COCO (KeyPoints), dataset, Raspberry Pi AI Camera',
    github: 'https://github.com/BenMiller0/AI-Camera-Based-Gesture-Response-System-in-Python',
  }
];

const windowsInfo = {
  aboutWindow: {
    title: 'About Me',
    label: 'About me',
    color: 'lightgreen',
    content: (
      <>
        <h2>About Me</h2>
        <h3>Skills</h3>
        <p><b>Programming Languages:</b> C/C++, ARM Assembly, System Verilog, Python, MATLAB, Java, JavaScript, TypeScript</p>
        <p><b>Hardware:</b> ESP 32, Raspberry Pi, sensors (e.g., accelerometers, gyroscopes), motors, camera modules</p>
        <p><b>Operating Systems:</b> Linux, macOS, Windows</p>
      </>
    )
  },
};

const Window = ({ id, title, children, onClose, position, onDrag }) => {
  const windowRef = useRef(null);
  const headerRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left mouse button
    if (!windowRef.current) return;

    const rect = windowRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    isDragging.current = true;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    
    onDrag(id, {
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y
    });
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
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        position: 'absolute',
      }}
    >
      <div 
        className="window-header" 
        ref={headerRef}
        onMouseDown={handleMouseDown}
      >
        <span>{title}</span>
        <button className="close-button" onClick={onClose}>&times;</button>
      </div>
      <div className="window-content">{children}</div>
    </div>
  );
};

const App = () => {
  const [openWindows, setOpenWindows] = useState([]);
  const [zIndexCounter, setZIndexCounter] = useState(10);

  const openWindow = (id, title, content) => {
    const existingWindowIndex = openWindows.findIndex(win => win.id === id);
    
    if (existingWindowIndex === -1) {
      setOpenWindows([...openWindows, { 
        id, 
        title, 
        content,
        position: { 
          x: 100 + (openWindows.length * 30) % 500,
          y: 100 + (openWindows.length * 30) % 300 
        },
        zIndex: zIndexCounter
      }]);
      setZIndexCounter(zIndexCounter + 1);
    } else {
      // Bring to front if already open
      bringToFront(id);
    }
  };

  const closeWindow = (id) => {
    setOpenWindows(openWindows.filter(win => win.id !== id));
  };

  const updateWindowPosition = (id, newPosition) => {
    setOpenWindows(openWindows.map(win => 
      win.id === id ? { ...win, position: newPosition } : win
    ));
  };

  const bringToFront = (id) => {
    setOpenWindows(openWindows.map(win => 
      win.id === id ? { ...win, zIndex: zIndexCounter } : win
    ));
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
                  {p.github && <p><a href={p.github} target="_blank" rel="noopener noreferrer">GitHub</a></p>}
                </>
              ))}
            >
              <div className="folder-icon" />
              <div className="folder-name">{p.label}</div>
            </div>
          ))}

          {Object.entries(windowsInfo).map(([id, win]) => (
            <div
              key={id}
              className="folder"
              onClick={() => openWindow(id, win.title, win.content)}
            >
              <div
                className="folder-icon"
                style={{ background: win.color }}
              />
              <div className="folder-name">{win.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;