// ======================
// MAIN APPLICATION CLASS
// ======================
class DesktopApp {
  constructor() {
    this.init();
  }

  // Initialize the application
  init() {
    this.setupClock();
    this.setupStartMenu();
    this.createFolders();
    this.setupExistingWindows();
    this.setupMenuItems();
    this.setupCursorAnimation();
  }

  // ======================
  // UTILITY FUNCTIONS
  // ======================
  setupClock() {
    const updateTime = () => {
      const now = new Date();
      document.getElementById('timeDisplay').textContent = 
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    
    updateTime();
    setInterval(updateTime, 1000);
  }

  setupCursorAnimation() {
    const cursor = document.querySelector('.cursor');
    if (cursor) {
      setInterval(() => {
        cursor.style.visibility = cursor.style.visibility === 'hidden' ? 'visible' : 'hidden';
      }, 500);
    }
  }

  // ======================
  // START MENU FUNCTIONS
  // ======================
  setupStartMenu() {
    const startButton = document.getElementById('startButton');
    const startMenu = document.getElementById('startMenu');
    
    startButton.addEventListener('click', (e) => {
      e.stopPropagation();
      startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', () => {
      startMenu.style.display = 'none';
    });
  }

  setupMenuItems() {
    document.querySelectorAll('.menu-item[data-window]').forEach(item => {
      item.addEventListener('click', () => {
        this.openWindow(item.dataset.window);
        document.getElementById('startMenu').style.display = 'none';
      });
    });
  }

  // ======================
  // FOLDER FUNCTIONS
  // ======================
  createFolders() {
    const projects = [
      { id: 'project1', name: 'Web App', description: 'A responsive web application built with React and Node.js', technologies: 'React, Node.js, MongoDB' },
      { id: 'project2', name: 'Mobile Game', description: 'A cross-platform mobile game developed with Unity', technologies: 'Unity, C#' },
      { id: 'project3', name: 'Data Visualization', description: 'Interactive data visualization dashboard', technologies: 'D3.js, Python, Flask' },
      { id: 'project4', name: 'E-commerce Site', description: 'Full-featured online store with payment processing', technologies: 'React, Node.js, Stripe API' }
    ];

    const systemFolders = [
      { id: 'about', name: 'About Me', iconColor: '#4CAF50', windowId: 'aboutWindow' },
      { id: 'contact', name: 'Contact', iconColor: '#2196F3', windowId: 'contactWindow' }
    ];

    const iconsContainer = document.getElementById('iconsContainer');
    
    // Create project folders
    projects.forEach(project => {
      this.createFolder(iconsContainer, project, () => {
        this.openProjectWindow(project);
      });
    });

    // Create system folders
    systemFolders.forEach(folder => {
      this.createFolder(iconsContainer, {
        ...folder,
        id: folder.windowId
      }, () => {
        this.openWindow(folder.windowId);
      }, folder.iconColor);
    });
  }

  createFolder(container, folderData, clickHandler, iconColor = '') {
    const folder = document.createElement('div');
    folder.className = 'folder';
    folder.innerHTML = `
      <div class="folder-icon" ${iconColor ? `style="background-color: ${iconColor}"` : ''}></div>
      <div class="folder-name">${folderData.name}</div>
    `;
    
    folder.addEventListener('dblclick', clickHandler);
    container.appendChild(folder);
  }

  // ======================
  // WINDOW FUNCTIONS
  // ======================
  setupExistingWindows() {
    document.querySelectorAll('.window').forEach(window => {
      this.setupWindowBehavior(window);
    });
  }

  openWindow(windowId) {
    const window = document.getElementById(windowId);
    if (window) {
      window.style.display = 'block';
      this.bringToFront(window);
    }
  }

  openProjectWindow(project) {
    let window = document.getElementById(`window-${project.id}`);
    
    if (!window) {
      window = this.createProjectWindow(project);
      this.setupWindowBehavior(window);
    }
    
    window.style.display = 'block';
    this.bringToFront(window);
  }

  createProjectWindow(project) {
    const window = document.createElement('div');
    window.className = 'window';
    window.id = `window-${project.id}`;
    window.innerHTML = `
      <div class="window-header">
        <span>${project.name}</span>
        <button class="close-button">&times;</button>
      </div>
      <div class="window-content">
        <h2>${project.name}</h2>
        <p>${project.description}</p>
        <h3>Technologies Used:</h3>
        <p>${project.technologies}</p>
      </div>
    `;
    
    document.body.appendChild(window);
    return window;
  }

  setupWindowBehavior(window) {
    const header = window.querySelector('.window-header');
    const closeButton = window.querySelector('.close-button');
    
    // Make draggable
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    header.onmousedown = (e) => {
      e.preventDefault();
      this.bringToFront(window);
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = () => {
        document.onmouseup = null;
        document.onmousemove = null;
      };
      document.onmousemove = (e) => {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        window.style.top = (window.offsetTop - pos2) + "px";
        window.style.left = (window.offsetLeft - pos1) + "px";
      };
    };
    
    // Close button
    closeButton.addEventListener('click', () => {
      window.style.display = 'none';
    });
  }

  bringToFront(element) {
    const windows = document.querySelectorAll('.window');
    let maxZ = 10;
    
    windows.forEach(win => {
      const z = parseInt(win.style.zIndex) || 10;
      maxZ = Math.max(maxZ, z);
    });
    
    element.style.zIndex = maxZ + 1;
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DesktopApp();
});