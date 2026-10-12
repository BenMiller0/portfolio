import React from 'react';

const biography = "As a Computer Science student at UC San Diego (GPA 3.8), I have experience in embedded systems, AI/ML, and full-stack development. I've built real-time hardware control systems, machine learning systems, and full-stack apps, combining hardware integration with software engineering to deliver interdisciplinary solutions.";
const skills = [
  ['Programming Languages', 'C, C++, ARM Assembly, System Verilog, Python, MATLAB, Java, JavaScript, TypeScript'],
  ['Embedded Systems', 'FreeRTOS, I2C, PWM, GPIO, ESP32, Servos, Raspberry Pi'],
  ['Web Development', 'Flask, FastAPI, React, Node.js, REST APIs, Tailwind CSS, HTML, Vite, Express'],
  ['Machine Learning', 'NumPy, PyTorch, Pandas, scikit-learn, OpenCV'],
  ['Tools & DevOps', 'Linux, Git, Docker, CI/CD, Bash, Agile/Scrum, Virtual Machines']
];
const portfolioDescription = 'This portfolio is designed to look and feel like a desktop environment, showcasing projects in embedded systems, AI/ML, and app/web app development.';
const techStack = 'React 19, Vite, custom CSS, and JSON-based project configuration.';
const inspiration = 'Inspired by the simplicity and nostalgia of old OS interfaces.';

const ReadmeContent = () => (
  <>
    <h2>README</h2>
    <h3>About Me</h3>
    <p>{biography}</p>
    <h3>Skills</h3>
    {skills.map(([label, value]) => <p key={label}><b>{label}:</b> {value}</p>)}
    <h3>About This Portfolio</h3>
    <p>{portfolioDescription}</p>
    <p><b>Tech Stack:</b> {techStack}</p>
    <p>{inspiration}</p>
  </>
);

export const aboutSiteWindow = {
  id: 'aboutSiteWindow',
  title: 'README',
  label: 'README.txt',
  color: '#fb7185',
  text: [
    'Benjamin Miller', 'UC San Diego - Computer Science', 'Embedded Systems & Software Engineer',
    '', 'About Me', biography, '', 'Skills',
    ...skills.map(([label, value]) => `${label}: ${value}`),
    '', 'About This Portfolio', portfolioDescription, `Tech Stack: ${techStack}`, inspiration
  ].join('\n'),
  component: ReadmeContent
};
