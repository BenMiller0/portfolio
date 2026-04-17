import React from 'react';

export const windowsInfo = {
  aboutWindow: {
    title: 'About Me',
    label: 'About me',
    color: 'lightgreen',
    content: (
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
    )
  },
  aboutSiteWindow: {
    title: 'README',
    label: 'README',
    color: '#f2f2f2',
    content: (
      <>
        <h2>README</h2>
        <p>This portfolio is designed to look and feel like a desktop environment, showcasing projects in embedded systems, AI/ML, and app/web app development.</p>
        <p>Click on folders to open project windows, and drag them around like real windows. Use the fullscreen button to expand windows.</p>
        <p><b>Tech Stack:</b> React 19, Vite, Custom CSS with dark mode, JSON-based project configuration, Font Awesome icons</p>
        <p>Inspired by the simplicity and nostalgia of old OS interfaces.</p>
      </>
    )
  },
  experienceWindow: {
    title: 'Experience',
    label: 'Experience',
    color: 'orange',
    content: (
      <div className="space-y-6 p-4">
        <div>
          <h3 className="font-bold">Software Engineering Lead & VP, Themed Entertainment Association at UCSD</h3>
          <p className="text-sm text-gray-500">Jun. 2024 – Present</p>
          <ul className="list-disc list-inside ml-4">
            <li>Led software development including launching the association's website (JavaScript, CI/CD) and themed attraction production software (Python, C, C++), enabling reliable themed attraction operations.</li>
            <li>Organized and represented UCSD in national engineering team competitions, coordinating interdisciplinary collaboration and ensuring effective teamwork.</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold">Software Engineering Intern, Western Digital</h3>
          <p className="text-sm text-gray-500">Sep. 2025 – Dec. 2025</p>
          <ul className="list-disc list-inside ml-4">
            <li>Improved hard drive firmware reliability and infrastructure via developing and testing embedded C++ features, validated through higher code quality.</li>
            <li>Developed internal tool for accelerating integration testing via a Python microservice and full stack application (Flask, SQLite, Javascript), as seen by successful end to end demonstrations to management.</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold">Software Developer Intern, Center for Applied Internet Data Analysis</h3>
          <p className="text-sm text-gray-500">Apr. 2025 – Aug. 2025</p>
          <ul className="list-disc list-inside ml-4">
            <li>Enhanced website usability by developing and maintaining JavaScript and Python scripts, streamlining content management workflows.</li>
            <li>Maintained a website with 2,000+ daily visitors, ensuring reliability and performance with Git-based collaborative version control.</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold">Resident Advisor, COSMOS UC San Diego</h3>
          <p className="text-sm text-gray-500">Jul. 2024 – Aug. 2024</p>
          <ul className="list-disc list-inside ml-4">
            <li>Provided guidance and mentorship for the Video Game Programming and Game AI Design group, empowering students through personalized support and advice.</li>
          </ul>
        </div>
      </div>
    )
  }
};
