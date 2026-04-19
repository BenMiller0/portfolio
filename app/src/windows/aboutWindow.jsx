import React from 'react';

const AboutContent = () => (
  <>
    <h2>About Me</h2>
    <p>As a third-year Computer Science student at UC San Diego (GPA 3.8), I have experience in embedded systems, AI/ML, and full-stack development. I've built real-time hardware control systems, machine learning systems, and full-stack apps, combining hardware integration with software engineering to deliver interdisciplinary solutions.</p>
    <h3>Skills</h3>
    <p><b>Programming Languages:</b> C, C++, ARM Assembly, System Verilog, Python, MATLAB, Java, JavaScript, TypeScript</p>
    <p><b>Embedded Systems:</b> FreeRTOS, I2C, PWM, GPIO, ESP32, Servos, Raspberry Pi</p>
    <p><b>Web Development:</b> Flask, FastAPI, React, Node.js, REST APIs, Tailwind CSS, HTML, Vite, Express</p>
    <p><b>Machine Learning:</b> NumPy, PyTorch, Pandas, scikit-learn, OpenCV</p>
    <p><b>Tools & DevOps:</b> Linux, Git, Docker, CI/CD, Bash, Agile/Scrum, Virtual Machines</p>
  </>
);

export const aboutWindow = {
  id: 'aboutWindow',
  title: 'About Me',
  label: 'About me',
  color: 'lightgreen',
  component: AboutContent
};
