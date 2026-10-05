import { useId } from 'react';
import '../assets/desktop-icons.css';

const documentMarks = {
  aboutWindow: <><circle cx="37" cy="31" r="6" /><path d="M26 49v-3c0-9 22-9 22 0v3Z" /></>,
  aboutSiteWindow: <path d="m29 30-7 7 7 7m16-14 7 7-7 7m-6-17-5 20" />,
  experienceWindow: <><rect x="23" y="29" width="30" height="20" rx="3" /><path d="M32 29v-5h12v5M23 37q15 8 30 0m-15 1v5" /></>,
  'hardware-resume': <><rect x="29" y="24" width="18" height="18" rx="2" /><path d="M34 20v4m8-4v4m-8 18v4m8-4v4M25 29h4m-4 8h4m18-8h4m-4 8h4M34 29h8v8h-8Z" /></>,
  'software-resume': <path d="m30 26-8 8 8 8m16-16 8 8-8 8m-5-20-6 24" />,
  status: <><path d="M25 30h25M25 37h25M25 44h16" /><circle cx="53" cy="54" r="5" /></>
};

const DesktopIcon = ({ kind }) => {
  const id = useId();
  const isResume = kind.endsWith('-resume');
  const isDocument = kind in documentMarks;
  return (
    <span className={`desktop-visual desktop-visual-${kind}`} aria-hidden="true">
      <svg viewBox={kind === 'projects' ? '0 0 80 64' : '0 0 80 80'} focusable="false">
        <defs>
          <linearGradient id={`${id}-surface`} x2=".8" y2="1">
            <stop className="desktop-surface-start" /><stop offset="1" className="desktop-surface-end" />
          </linearGradient>
        </defs>
        {isDocument && <>
          <path className="desktop-paper-back" d="M19 9h34l12 13v48H19Z" />
          <path className="desktop-paper" d="M15 6h34l14 14v49a3 3 0 0 1-3 3H18a3 3 0 0 1-3-3Z" fill={`url(#${id}-surface)`} />
          <path className="desktop-fold" d="M49 6v11a3 3 0 0 0 3 3h11" />
          <path className="desktop-paper-shine" d="M19 23V10h25" />
          <g className={`desktop-document-mark${isResume ? ' desktop-resume-mark' : ''}`}>{documentMarks[kind]}</g>
          {isResume ? <g className="desktop-pdf-badge"><rect x="18" y="51" width="48" height="17" rx="4" /><text x="42" y="63" textAnchor="middle">PDF</text></g> : <path className="desktop-document-lines" d="M25 57h27m-27 6h19" />}
        </>}
        {kind === 'terminal' && <>
          <rect className="desktop-terminal-frame" x="4" y="9" width="72" height="63" rx="11" fill={`url(#${id}-surface)`} />
          <path className="desktop-terminal-divider" d="M5 26h70" />
          <circle cx="14" cy="18" r="2" fill="#ef8792" /><circle cx="22" cy="18" r="2" fill="#e7be67" /><circle cx="30" cy="18" r="2" fill="#75cfb2" />
          <path className="desktop-terminal-prompt" d="m18 38 10 8-10 8" />
          <path className="desktop-terminal-code" d="M38 40h19m-19 6h12" />
          <path className="desktop-terminal-cursor" d="M36 55h12" />
        </>}
        {kind === 'github' && <>
          <rect className="desktop-social-frame" x="4" y="4" width="72" height="72" rx="19" fill={`url(#${id}-surface)`} />
          <image className="desktop-github-mark" href="/icons/github.png" x="16" y="14" width="48" height="48" />
          <path className="desktop-social-highlight" d="M18 9h24" />
        </>}
        {kind === 'linkedin' && <>
          <rect className="desktop-social-frame" x="4" y="4" width="72" height="72" rx="19" fill={`url(#${id}-surface)`} />
          <g className="desktop-linkedin-mark"><circle cx="23" cy="24" r="4.5" /><path d="M19 33h8v28h-8Zm15 0h8v4c3-6 19-7 19 9v15h-8V47c0-8-11-8-11 0v14h-8Z" /></g>
        </>}
        {kind === 'projects' && <>
          <path className="desktop-folder-back" d="M8 29V13a5 5 0 0 1 5-5h15q2 0 3.5 1.5l6 6Q39 17 41 17h26a5 5 0 0 1 5 5v31a5 5 0 0 1-5 5H13a5 5 0 0 1-5-5Z" />
          <g className="desktop-folder-preview desktop-folder-preview-one"><rect x="23" y="11" width="23" height="29" rx="3" /><path d="M28 18h13v10H28Zm3 14h7" /></g>
          <g className="desktop-folder-preview desktop-folder-preview-two"><rect x="28" y="10" width="23" height="29" rx="3" /><path d="M33 31V23m6 8V18m6 13V21" /></g>
          <g className="desktop-folder-preview desktop-folder-preview-three"><rect x="34" y="11" width="23" height="29" rx="3" /><path d="m42 20-4 5 4 5m6-10 4 5-4 5" /></g>
          <g className="desktop-folder-lid">
            <path className="desktop-folder-front" d="M9 25h62q5 0 4.5 5l-2.5 25q-.5 5-5.5 5h-55Q7.5 60 7 55L4.5 30Q4 25 9 25Z" fill={`url(#${id}-surface)`} />
          </g>
        </>}
      </svg>
    </span>
  );
};

export default DesktopIcon;
