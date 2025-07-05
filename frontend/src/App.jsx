import React, { useState, useEffect, useRef } from 'react';
import './styles.css';

const projects = [
  { id: 'project1', name: 'AI Camera-Based Gesture Response System in Python', description: 'A responsive web application built with React and Node.js', technologies: 'React, Node.js, MongoDB' },
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
        <p><b>Hardware:</b>  ESP 32, Raspberry Pi, sensors (e.g., accelerometers, gyroscopes), motors, camera modules, power supply units, and communication modules</p> 
        <p><b>Operating Systems:</b> Linux, macOS, Windows</p>
        <p><b>Web Development:</b> jQuery, Hugo, Node.js, React, CSS, HTML, REST APIs, Vite, Express</p>
        <p><b>Other:</b> PyTorch, Git Version Control, Bash, CI/CD, Scrum/Agile, Virtual Machines, MongoDB</p>
      </>
    )
  },
};

const Window = ({ id, title, children, onClose }) => (
  <div className="window">
    <div className="window-header">
      <span>{title}</span>
      <button className="close-button" onClick={onClose}>&times;</button>
    </div>
    <div className="window-content">{children}</div>
  </div>
);

const App = () => {
  const [openWindows, setOpenWindows] = useState([]);

  const openWindow = (id, title, content) => {
    if (!openWindows.some(win => win.id === id)) {
      setOpenWindows([...openWindows, { id, title, content }]);
    }
  };

  const closeWindow = (id) => {
    setOpenWindows(openWindows.filter(win => win.id !== id));
  };

    return (
    <div className="desktop-background" onClick={() => console.log('Clicked desktop background')}>
      {openWindows.map(win => (
        <Window
          key={win.id}
          id={win.id}
          title={win.title}
          onClose={() => closeWindow(win.id)}
        >
          {win.content}
        </Window>
      ))}
      <div className="name-display">Benjamin Miller</div>
      <div className="school-display">UC San Diego - Computer Science</div>

      {/* DESKTOP ICONS */}
      <div className="desktop">
        <div className="icons-container">
          {projects.map(p => (
            <div
              key={p.id}
              className="folder"
              onClick={() => {
                openWindow(p.id, p.name, (
                  <>
                    <h2>{p.name}</h2>
                    <p>{p.description}</p>
                    <h3>Technologies Used:</h3>
                    <p>{p.technologies}</p>
                  </>
                ));
              }}
            >
              <div className="folder-icon"></div>
              <div className="folder-name">{p.name}</div>
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
              style={{
                background: win.color || 'linear-gradient(145deg, #2196F3, #0d8aee)'
              }}
            />
            <div className="folder-name">{win.label || win.title}</div>
          </div>
          ))}
        </div>
      </div>

      
    </div>
    );
};

export default App;
