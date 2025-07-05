import React, { useState, useEffect, useRef } from 'react';
import './styles.css';

const projects = [
  { id: 'project1', name: 'Web App', description: 'A responsive web application built with React and Node.js', technologies: 'React, Node.js, MongoDB' },
  { id: 'project2', name: 'Mobile Game', description: 'A cross-platform mobile game developed with Unity', technologies: 'Unity, C#' },
  { id: 'project3', name: 'Data Visualization', description: 'Interactive data visualization dashboard', technologies: 'D3.js, Python, Flask' },
];

const windowsInfo = {
  aboutWindow: {
    title: 'About Me',
    content: (
      <>
        <h2>About Me</h2>
        <p>Welcome to my portfolio! I'm a creative developer who builds amazing digital experiences.</p>
        <p>Skills: HTML, CSS, JavaScript, React, Node.js</p>
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
      {/* WINDOWS: Place OUTSIDE the .desktop div so z-index layering works properly */}
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
              <div className="folder-icon"></div>
              <div className="folder-name">{win.title}</div>
            </div>
          ))}
        </div>
      </div>

      
    </div>
    );
};

export default App;
