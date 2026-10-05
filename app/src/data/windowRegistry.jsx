import { aboutWindow } from '../windows/aboutWindow';
import { aboutSiteWindow } from '../windows/readmeWindow';
import { experienceWindow } from '../windows/experienceWindow';
import { terminalWindow } from '../windows/TerminalWindow';

export const systemWindows = {
  aboutWindow,
  aboutSiteWindow,
  experienceWindow
};

export const getTerminalDesktopWindow = (projects) => terminalWindow(projects);

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
    path: '/resumes/Resume_Benjamin_Miller.pdf'
  },
  {
    id: 'software-resume',
    label: 'Software Resume',
    title: 'Software Resume',
    path: '/resumes/Resume-Benjamin-Miller.pdf'
  }
];
