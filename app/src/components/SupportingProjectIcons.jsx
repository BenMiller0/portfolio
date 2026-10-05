import { useId } from 'react';
import '../assets/supporting-project-icons.css';

const Scene = ({ kind, children }) => {
  const id = useId();
  return (
    <svg className={`supporting-icon scene-${kind}`} viewBox="0 0 80 64" focusable="false">
      <defs>
        <linearGradient id={`${id}-surface`} x2=".8" y2="1">
          <stop className="scene-surface-start" /><stop offset="1" className="scene-surface-end" />
        </linearGradient>
      </defs>
      {children(`url(#${id}-surface)`)}
    </svg>
  );
};

export const VerificationIcon = () => (
  <Scene kind="verify">{surface => <>
    <path className="scene-metal" d="M35 48h10l2 10h9v3H24v-3h9Z" />
    <rect className="scene-frame" x="4" y="5" width="72" height="48" rx="6" fill={surface} />
    <rect className="lab-screen" x="8" y="10" width="64" height="36" rx="3" />
    <path className="lab-trace" d="M15 17h7m-7 6h9m-9 6h7m-7 6h9m10-18h8m-8 6h10m-10 6h8m-8 6h10" />
    <rect className="lab-chip" x="22" y="16" width="15" height="21" rx="2" />
    <path className="lab-chip-core" d="M26 21h7v10h-7Z" />
    <g className="lab-scan-unit"><path className="lab-scan-halo" d="M12 15h30" /><path className="lab-scan" d="M12 15h30" /></g>
    <path className="lab-brackets" d="M48 19v-5h7m12 5v-5h-7m-12 18v5h7m12-5v5h-7" />
    <circle className="lab-camera" cx="57.5" cy="25.5" r="9" />
    <circle className="lab-lens" cx="57.5" cy="25.5" r="5" />
    <circle className="lab-lens-glint" cx="56" cy="24" r="1.5" />
    <circle className="lab-led" cx="14" cy="49" r="1.4" />
    <path className="lab-progress" d="M20 49h17" />
    <g className="lab-verified"><circle cx="68" cy="47" r="8" /><path d="m64 47 3 3 5-6" /></g>
  </>}</Scene>
);

export const ChartIcon = () => (
  <Scene kind="chart">{surface => <>
    <rect className="scene-frame" x="5" y="5" width="70" height="54" rx="7" fill={surface} />
    <path className="data-grid" d="M13 23h54M13 34h54M13 45h54M26 19v32m13-32v32m13-32v32" />
    <path className="data-heading" d="M13 13h18m4 0h6" />
    <circle className="data-live" cx="66" cy="13" r="2" />
    <g className="data-bars">
      <rect className="data-bar" x="16" y="38" width="8" height="13" rx="1.5" />
      <rect className="data-bar data-bar-two" x="29" y="32" width="8" height="19" rx="1.5" />
      <rect className="data-bar data-bar-three" x="42" y="27" width="8" height="24" rx="1.5" />
      <rect className="data-bar data-bar-four" x="55" y="20" width="8" height="31" rx="1.5" />
    </g>
    <path className="data-trend-halo" d="m15 36 16-12 12 5 20-14" />
    <path className="data-trend" d="m15 36 16-12 12 5 20-14" pathLength="100" />
    <circle className="data-point" cx="15" cy="36" r="2" /><circle className="data-point" cx="31" cy="24" r="2" /><circle className="data-point" cx="43" cy="29" r="2" />
    <g className="data-target"><circle cx="63" cy="15" r="5" /><circle cx="63" cy="15" r="2" /></g>
    <path className="data-axis" d="M12 19v33h55" />
  </>}</Scene>
);

export const CalendarIcon = () => (
  <Scene kind="calendar">{surface => <>
    <rect className="planner-back" x="13" y="7" width="55" height="51" rx="6" />
    <rect className="scene-frame" x="8" y="11" width="55" height="49" rx="6" fill={surface} />
    <path className="planner-header" d="M8 24v-7q0-6 6-6h43q6 0 6 6v7Z" />
    <path className="planner-binding" d="M20 7v10m30-10v10" />
    <path className="planner-binding-shine" d="M19 8v7m30-7v7" />
    <g className="planner-dates"><rect x="17" y="31" width="6" height="5" rx="1" /><rect x="29" y="31" width="6" height="5" rx="1" /><rect x="41" y="31" width="6" height="5" rx="1" /><rect x="17" y="43" width="6" height="5" rx="1" /><rect x="29" y="43" width="6" height="5" rx="1" /></g>
    <rect className="planner-today" x="39" y="29" width="10" height="9" rx="2" />
    <g className="planner-check"><circle cx="60" cy="49" r="12" /><path d="m54 49 4 4 8-9" pathLength="20" /></g>
    <g className="planner-reminder"><circle cx="64" cy="13" r="8" /><path d="M64 9v5m0 3h.01" /></g>
  </>}</Scene>
);

export const CompressorIcon = () => (
  <Scene kind="archive">{surface => <>
    <g className="archive-page archive-page-left"><path d="M5 14h18l7 7v32H5Z" /><path d="M23 14v7h7M10 29h13m-13 6h13m-13 6h9" /></g>
    <g className="archive-page archive-page-right"><path d="M51 11h17l7 7v34H51Z" /><path d="M68 11v7h7M56 27h12m-12 6h12m-12 6h8" /></g>
    <rect className="scene-frame" x="24" y="5" width="32" height="55" rx="5" fill={surface} />
    <path className="archive-spine" d="M36 6h8v53h-8Z" />
    <path className="archive-teeth" d="M37 10h3m0 4h3m-6 4h3m0 4h3m-6 4h3m0 4h3m-6 4h3m0 4h3m-6 4h3m0 4h3m-6 4h3m0 4h3" />
    <g className="archive-slider"><rect x="35" y="17" width="10" height="12" rx="2" /><rect x="38" y="21" width="4" height="5" rx="1" /></g>
    <path className="archive-arrow archive-arrow-left" d="M8 55h11m-4-4 4 4-4 4" />
    <path className="archive-arrow archive-arrow-right" d="M72 55H61m4-4-4 4 4 4" />
  </>}</Scene>
);
