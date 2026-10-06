import { aboutWindow } from '../windows/aboutWindow';
import { aboutSiteWindow } from '../windows/readmeWindow';
import { experienceWindow } from '../windows/experienceWindow';
import { terminalWindow } from '../windows/TerminalWindow';

export const systemWindows = {
  aboutWindow,
  aboutSiteWindow,
  experienceWindow
};

export const getTerminalDesktopWindow = (projects) => terminalWindow(projects, {
  systemWindows, socialLinks, resumeLinks
});

export const socialLinks = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/BenMiller0'
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/benjamin-miller-ucsd'
  }
];

export const resumeLinks = [
  {
    id: 'hardware-resume',
    label: 'Hardware Resume',
    title: 'Hardware Resume',
    description: 'This résumé highlights my experience with low-level programming, firmware, and embedded systems.',
    path: '/resumes/Resume_Benjamin_Miller.pdf'
  },
  {
    id: 'software-resume',
    label: 'Software Resume',
    title: 'Software Resume',
    description: 'This résumé highlights my experience in application development and machine learning.',
    path: '/resumes/Resume-Benjamin-Miller.pdf'
  }
];
