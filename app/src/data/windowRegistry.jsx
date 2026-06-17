import { aboutWindow } from '../windows/aboutWindow';
import { aboutSiteWindow } from '../windows/readmeWindow';
import { experienceWindow } from '../windows/experienceWindow';
import { terminalWindow } from '../windows/TerminalWindow';

export const systemWindows = {
  aboutWindow,
  aboutSiteWindow,
  experienceWindow
};

export const terminalDesktopWindow = terminalWindow;

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
    label: 'Hardware_Resume.pdf',
    title: 'Hardware Resume',
    path: '/resumes/hardware_resume.pdf'
  },
  {
    id: 'software-resume',
    label: 'Software_Resume.pdf',
    title: 'Software Resume',
    path: '/resumes/software_resume.pdf'
  }
];
