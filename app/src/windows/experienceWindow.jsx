import React from 'react';

const ExperienceContent = () => (
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
);

export const experienceWindow = {
  id: 'experienceWindow',
  title: 'Experience',
  label: 'Experience',
  color: 'orange',
  component: ExperienceContent
};
