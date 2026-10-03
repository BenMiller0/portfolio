import React from 'react';

const ReadmeContent = () => (
  <>
    <h2>README</h2>
    <p>This portfolio is designed to look and feel like a desktop environment, showcasing projects in embedded systems, AI/ML, and app/web app development.</p>
    <p><b>Tech Stack:</b> React 19, Vite, custom CSS, and JSON-based project configuration.</p>
    <p>Inspired by the simplicity and nostalgia of old OS interfaces.</p>
  </>
);

export const aboutSiteWindow = {
  id: 'aboutSiteWindow',
  title: 'README',
  label: 'README.txt',
  color: '#fb7185',
  component: ReadmeContent
};
