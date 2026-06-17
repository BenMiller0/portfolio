import React from 'react';

const experiences = [
  {
    role: 'Software Engineering Intern - Firmware, Western Digital',
    dates: 'Jun. 2026 - Present, Sep. 2025 - Dec. 2025',
    bullets: [
      'Designed and implemented C++ firmware for hard drive systems in an Agile environment, validated through unit and integration testing to improve firmware reliability.',
      'Improved system infrastructure by implementing embedded C++ features and enhanced error handling, increasing system stability in production codebase.',
      'Developed an internal tool for accelerating integration testing with a Python microservice and full-stack application (Flask, SQLite, JavaScript), demonstrated successfully to management.'
    ]
  },
  {
    role: 'Electronic Props Designer, Star Wars Club at UCSD',
    dates: 'Mar. 2026 - Present',
    bullets: [
      'Designed embedded systems and C++ firmware for props for film making and on campus promotional props using a real time operating system (RTOS) and microcontrollers resulting in screen accurate prop recreations.'
    ]
  },
  {
    role: 'Software Engineering Lead & VP, Themed Entertainment Association at UCSD',
    dates: 'Jun. 2024 - Jun. 2026',
    bullets: [
      "Led software development including launching the association's website (JavaScript, CI/CD) and themed attraction production software (Python, C, C++), enabling reliable themed attraction operations.",
      'Organized and represented UCSD in national engineering team competitions, coordinating interdisciplinary collaboration and ensuring effective teamwork.'
    ]
  },
  {
    role: 'Software Developer Intern, Center for Applied Internet Data Analysis',
    dates: 'Apr. 2025 - Aug. 2025',
    bullets: [
      'Enhanced website usability by developing and maintaining JavaScript and Python scripts, streamlining content management workflows.',
      'Maintained a website with 2,000+ daily visitors, ensuring reliability and performance with Git-based collaborative version control.'
    ]
  },
  {
    role: 'Resident Advisor, COSMOS UC San Diego',
    dates: 'Jul. 2024 - Aug. 2024',
    bullets: [
      'Provided guidance and mentorship for the Video Game Programming and Game AI Design group, empowering students through personalized support and advice.'
    ]
  }
];

const ExperienceContent = () => (
  <div className="experience-list">
    {experiences.map(experience => (
      <section key={experience.role} className="experience-item">
        <h3>{experience.role}</h3>
        <p className="experience-dates">{experience.dates}</p>
        <ul>
          {experience.bullets.map(bullet => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </section>
    ))}
  </div>
);

export const experienceWindow = {
  id: 'experienceWindow',
  title: 'Experience',
  label: 'experience.txt',
  color: '#facc15',
  component: ExperienceContent
};
