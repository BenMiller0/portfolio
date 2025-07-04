document.addEventListener('DOMContentLoaded', function() {
    // Update time display
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.getElementById('timeDisplay').textContent = timeString;
    }
    
    updateTime();
    setInterval(updateTime, 1000);

    // Start menu functionality
    const startButton = document.getElementById('startButton');
    const startMenu = document.getElementById('startMenu');

    startButton.addEventListener('click', function(e) {
        e.stopPropagation();
        startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
    });

    // Close start menu when clicking elsewhere
    document.addEventListener('click', function() {
        startMenu.style.display = 'none';
    });

    // Sample projects data
    const projects = [
        { id: 'project1', name: 'Web App', description: 'A responsive web application built with React and Node.js', technologies: 'React, Node.js, MongoDB' },
        { id: 'project2', name: 'Mobile Game', description: 'A cross-platform mobile game developed with Unity', technologies: 'Unity, C#' },
        { id: 'project3', name: 'Data Visualization', description: 'Interactive data visualization dashboard', technologies: 'D3.js, Python, Flask' },
        { id: 'project4', name: 'E-commerce Site', description: 'Full-featured online store with payment processing', technologies: 'React, Node.js, Stripe API' }
    ];

    // Create folder icons for projects
    const iconsContainer = document.querySelector('.icons-container');
    
    projects.forEach(project => {
        // Create folder element
        const folder = document.createElement('div');
        folder.className = 'folder';
        folder.innerHTML = `
            <div class="folder-icon"></div>
            <div class="folder-name">${project.name}</div>
        `;
        
        // Add click event to open project window
        folder.addEventListener('dblclick', function() {
            openProjectWindow(project);
        });
        
        iconsContainer.appendChild(folder);
    });

    // Add about and contact folders
    const aboutFolder = document.createElement('div');
    aboutFolder.className = 'folder';
    aboutFolder.innerHTML = `
        <div class="folder-icon" style="background-color: #4CAF50;"></div>
        <div class="folder-name">About Me</div>
    `;
    aboutFolder.addEventListener('dblclick', function() {
        openWindow('aboutWindow');
    });
    iconsContainer.appendChild(aboutFolder);

    const contactFolder = document.createElement('div');
    contactFolder.className = 'folder';
    contactFolder.innerHTML = `
        <div class="folder-icon" style="background-color: #2196F3;"></div>
        <div class="folder-name">Contact</div>
    `;
    contactFolder.addEventListener('dblclick', function() {
        openWindow('contactWindow');
    });
    iconsContainer.appendChild(contactFolder);

    // Make windows draggable
    const windows = document.querySelectorAll('.window');
    windows.forEach(window => {
        makeDraggable(window);
    });
});

function openWindow(windowId) {
    const window = document.getElementById(windowId);
    window.style.display = 'block';
    
    // Bring to front
    bringToFront(window);
}

function closeWindow(windowId) {
    document.getElementById(windowId).style.display = 'none';
}

function closeStartMenu() {
    document.getElementById('startMenu').style.display = 'none';
}

function openProjectWindow(project) {
    // Check if window already exists
    let window = document.getElementById(`window-${project.id}`);
    
    if (!window) {
        // Create new window if it doesn't exist
        window = document.createElement('div');
        window.className = 'window';
        window.id = `window-${project.id}`;
        window.innerHTML = `
            <div class="window-header">
                <span>${project.name}</span>
                <button class="close-button" onclick="closeWindow('window-${project.id}')">×</button>
            </div>
            <div class="window-content">
                <h2>${project.name}</h2>
                <p>${project.description}</p>
                <h3>Technologies Used:</h3>
                <p>${project.technologies}</p>
            </div>
        `;
        document.body.appendChild(window);
        
        // Make draggable
        makeDraggable(window);
        
        // Position randomly but within viewport
        const maxLeft = window.innerWidth - 500;
        const maxTop = window.innerHeight - 300;
        window.style.left = `${Math.min(Math.random() * maxLeft, maxLeft - 100)}px`;
        window.style.top = `${Math.min(Math.random() * maxTop, maxTop - 100)}px`;
    }
    
    // Show and bring to front
    window.style.display = 'block';
    bringToFront(window);
}

function makeDraggable(element) {
    const header = element.querySelector('.window-header');
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    header.onmousedown = dragMouseDown;
    
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        
        // Bring to front when clicked
        bringToFront(element);
        
        // Get the mouse cursor position at startup
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        
        // Calculate the new cursor position
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        // Set the element's new position
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }
    
    function closeDragElement() {
        // Stop moving when mouse button is released
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function bringToFront(element) {
    // Get all windows
    const windows = document.querySelectorAll('.window');
    
    // Find the highest z-index currently in use
    let maxZ = 10;
    windows.forEach(win => {
        const z = parseInt(win.style.zIndex) || 10;
        if (z > maxZ) maxZ = z;
    });
    
    // Set this element's z-index to be higher than the highest
    element.style.zIndex = maxZ + 1;
}