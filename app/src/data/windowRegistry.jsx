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
    href: 'https://github.com/BenMiller0',
    iconClassName: 'github-icon-image'
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/benjamin-miller-ucsd',
    iconClassName: 'linkedin-icon-image'
  }
];

export const resumeLinks = [
  {
    id: 'hardware-resume',
    label: 'Resume_Benjamin_Miller.pdf',
    title: 'Hardware Resume',
    path: '/resumes/Resume_Benjamin_Miller.pdf'
  },
  {
    id: 'software-resume',
    label: 'Resume-Benjamin-Miller.pdf',
    title: 'Software Resume',
    path: '/resumes/Resume-Benjamin-Miller.pdf'
  }
];
