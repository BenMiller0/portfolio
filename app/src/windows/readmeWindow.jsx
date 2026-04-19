import React from 'react';

const ReadmeContent = () => (
  <>
    <h2>README</h2>
    <p>This portfolio is designed to look and feel like a desktop environment, showcasing projects in embedded systems, AI/ML, and app/web app development.</p>
    <p>Click on folders to open project windows, and drag them around like real windows. Use the fullscreen button to expand windows.</p>
    <p><b>Tech Stack:</b> React 19, Vite, Custom CSS with dark mode, JSON-based project configuration, Font Awesome icons</p>
    <p>Inspired by the simplicity and nostalgia of old OS interfaces.</p>
  </>
);

export const aboutSiteWindow = {
  id: 'aboutSiteWindow',
  title: 'README',
  label: 'README',
  color: '#f2f2f2',
  component: ReadmeContent
};
