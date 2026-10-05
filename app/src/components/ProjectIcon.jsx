const VaderIcon = () => (
  <svg className="vader-figure" viewBox="0 0 80 62" focusable="false">
    <path className="vader-cape" d="M3 62 9 43c2-7 10-12 22-15h18c12 3 20 8 22 15l6 19Z" />
    <path className="vader-cape-fold" d="m10 62 7-21 12-9-7 30Zm60 0-7-21-12-9 7 30Z" />
    <path className="vader-helmet-shell" d="M20 31 24 18C24 7 31 1 40 1s16 6 16 17l4 13-8-4-2 8-6-5-2 8h-4l-2-8-6 5-2-8Z" />
    <path className="vader-dome" d="M26 19C26 8 32 3 40 3s14 5 14 16l-5-5-9-4-9 4Z" />
    <path className="vader-face" d="m27 19 5-6 8-3 8 3 5 6-3 10-6 8h-8l-6-8Z" />
    <path className="vader-cheek" d="m28 26 8-2-2 8-5-3Zm24 0-8-2 2 8 5-3Z" />
    <path className="vader-brow" d="m28 18 10-3 2 2 2-2 10 3-2 3-8-2-2 2-2-2-8 2Z" />
    <path className="vader-eye" d="m29 20 9-2-2 5-7 1Zm22 0-9-2 2 5 7 1Z" />
    <path className="vader-nose" d="m40 18 4 11-4 4-4-4Z" />
    <path className="vader-respirator" d="m34 29 6 4 6-4 3 7-5 5h-8l-5-5Z" />
    <path className="vader-grille" d="M35 33h10M36 36h8M38 31v8m4-8v8" />
    <path className="vader-helmet-highlight" d="M31 8c3-4 8-5 12-4m-15 9-3 10" />
    <path className="vader-armor" d="M18 62V42l13-10 5 7h8l5-7 13 10v20Z" />
    <path className="vader-armor-line" d="m20 43 13-8m27 8-13-8M25 62l4-23m26 23-4-23" />
    <g className="vader-chest-box">
      <path d="m31 42 2-3h14l2 3v13H31Z" />
      <path className="vader-panel-edge" d="M33 43h14v10H33Z" />
      <rect className="vader-switch vader-switch-red" x="34.5" y="44.5" width="3" height="3" rx=".5" />
      <rect className="vader-switch vader-switch-blue" x="42.5" y="44.5" width="3" height="3" rx=".5" />
      <rect className="vader-switch vader-switch-amber" x="34.5" y="49" width="3" height="2.5" rx=".5" />
      <rect className="vader-switch vader-switch-white" x="42.5" y="49" width="3" height="2.5" rx=".5" />
      <path className="vader-panel-bars" d="M39 44.5v7m2-7v7" />
    </g>
    <g className="vader-belt-unit">
      <path className="vader-belt-strap" d="M18 55h44v6H18Z" />
      <path className="vader-belt-box" d="M20 54h10v8H20Zm30 0h10v8H50Z" />
      <path className="vader-buckle" d="M35 54h10v8H35Z" />
      <circle className="vader-belt-light vader-belt-light-red" cx="23" cy="57" r="1.2" />
      <circle className="vader-belt-light vader-belt-light-green" cx="27" cy="57" r="1.2" />
      <circle className="vader-belt-light vader-belt-light-blue" cx="53" cy="57" r="1.2" />
      <circle className="vader-belt-light vader-belt-light-amber" cx="57" cy="57" r="1.2" />
      <path className="vader-buckle-detail" d="M37 56h6v4h-6Z" />
    </g>
  </svg>
);

const projectIcons = {
  project1: (
    <svg viewBox="0 0 80 64" focusable="false">
      <path className="taro-body" d="M10 64c1-17 10-27 27-28 16 1 25 11 27 28Z" />
      <path className="taro-wing" d="M11 47c9 0 19 5 27 17H9c-5-7-5-13 2-17Z" />
      <path className="taro-wing-feathers" d="m9 50 18 9M7 55l18 6M8 60l14 3" />
      <path className="taro-neck-ring" d="M25 39h25l-3 9H28Z" />
      <path className="taro-head" d="M13 25C13 10 23 2 37 2c14 0 24 9 24 23 0 13-10 22-24 22S13 38 13 25Z" />
      <path className="taro-face-patch" d="M37 7c12 1 20 9 20 19 0 8-5 15-13 19-4-7-5-14-4-22 0-6-1-11-3-16Z" />
      <g className="taro-crest">
        <path d="M26 7C20 2 17 0 12 0" />
        <path d="M27 6c-1-7 0-9 3-12" />
      </g>
      <g className="taro-eye-unit">
        <circle className="taro-eye-white" cx="28" cy="19" r="7.5" />
        <circle className="taro-eye" cx="28" cy="19" r="4.5" />
        <circle className="taro-eye-glint" cx="26.8" cy="17.7" r="1.4" />
      </g>
      <g className="taro-eye-unit">
        <circle className="taro-eye-white" cx="53" cy="12" r="7.5" />
        <circle className="taro-eye" cx="53" cy="12" r="4.5" />
        <circle className="taro-eye-glint" cx="51.8" cy="10.7" r="1.4" />
      </g>
      <g className="taro-beak-upper">
        <path className="taro-beak-gold" d="M45 20c11-3 23 2 32 10-9 5-20 6-32 2Z" />
        <path className="taro-beak-sheen" d="M49 21c9-1 16 2 23 7-8-2-14-1-21 2Z" />
        <path className="taro-beak-tip" d="m69 26 8 4-7 4-5-3Z" />
      </g>
      <g className="taro-beak-lower">
        <path className="taro-beak-gold" d="M46 32c9 1 17 2 25 2-4 7-14 9-24 4Z" />
        <path className="taro-mouth" d="M47 32c8 1 15 2 23 2-7 2-14 2-22 1Z" />
      </g>
    </svg>
  ),
  project2: (
    <svg viewBox="0 0 80 64" focusable="false">
      <rect className="verify-monitor" x="7" y="7" width="66" height="48" rx="6" />
      <rect className="verify-screen" x="12" y="12" width="56" height="36" rx="3" />
      <path className="verify-board" d="M20 18h25v24H20Z" />
      <path className="verify-circuit" d="M24 23h7v5h8m-15 7h9m7-12h3m-3 12h5" />
      <circle className="verify-camera" cx="56" cy="29" r="8" />
      <circle className="verify-lens" cx="56" cy="29" r="4" />
      <path className="verify-scan" d="M14 17h52" />
      <circle className="verify-status verify-status-one" cx="55" cy="44" r="1.8" />
      <circle className="verify-status verify-status-two" cx="62" cy="44" r="1.8" />
      <path className="verify-stand" d="M34 55h12l4 6H30Z" />
    </svg>
  ),
  project4: (
    <svg viewBox="0 0 80 64" focusable="false">
      <circle className="spell-orb" cx="41" cy="30" r="23" />
      <g className="spell-wand">
        <path className="spell-wand-body" d="m17 55 30-31" />
        <path className="spell-wand-handle" d="m14 58 11-12" />
      </g>
      <path className="spell-star spell-star-main" d="m51 9 3 9 9 3-9 3-3 9-3-9-9-3 9-3Z" />
      <path className="spell-star spell-star-small-one" d="m66 34 1.5 4.5L72 40l-4.5 1.5L66 46l-1.5-4.5L60 40l4.5-1.5Z" />
      <path className="spell-star spell-star-small-two" d="m35 7 1 3 3 1-3 1-1 3-1-3-3-1 3-1Z" />
      <path className="spell-trail" d="M22 47C36 48 39 37 45 28s15-9 23-6" />
    </svg>
  ),
  project5: (
    <svg viewBox="0 0 80 64" focusable="false">
      <rect className="ml-frame" x="7" y="7" width="66" height="51" rx="7" />
      <path className="ml-grid" d="M15 17h50M15 29h50M15 41h50M26 13v37m13-37v37m13-37v37" />
      <rect className="ml-bar ml-bar-one" x="18" y="37" width="7" height="13" rx="1" />
      <rect className="ml-bar ml-bar-two" x="31" y="30" width="7" height="20" rx="1" />
      <rect className="ml-bar ml-bar-three" x="44" y="23" width="7" height="27" rx="1" />
      <rect className="ml-bar ml-bar-four" x="57" y="16" width="7" height="34" rx="1" />
      <path className="ml-trend" d="m17 40 14-9 11 3 20-17" />
      <circle className="ml-point" cx="17" cy="40" r="2" />
      <circle className="ml-point" cx="31" cy="31" r="2" />
      <circle className="ml-point" cx="42" cy="34" r="2" />
      <circle className="ml-point" cx="62" cy="17" r="2" />
    </svg>
  ),
  project6: (
    <svg viewBox="0 0 80 64" focusable="false">
      <rect className="events-page events-page-back" x="15" y="7" width="52" height="51" rx="7" />
      <rect className="events-page" x="10" y="10" width="55" height="50" rx="7" />
      <path className="events-header" d="M10 23h55" />
      <path className="events-ring" d="M22 7v8m31-8v8" />
      <circle className="events-day" cx="22" cy="33" r="3" />
      <circle className="events-day" cx="32" cy="33" r="3" />
      <circle className="events-day events-day-active" cx="42" cy="33" r="4" />
      <circle className="events-day" cx="52" cy="33" r="3" />
      <circle className="events-day" cx="22" cy="44" r="3" />
      <circle className="events-day" cx="32" cy="44" r="3" />
      <path className="events-check" d="m49 45 4 4 9-11" />
      <circle className="events-alert" cx="64" cy="12" r="7" />
      <path className="events-alert-mark" d="M64 8v5m0 3h.01" />
    </svg>
  ),
  project7: (
    <svg viewBox="0 0 80 64" focusable="false">
      <g className="compress-file compress-file-left">
        <path d="M7 9h23l8 8v39H7Z" />
        <path d="M30 9v8h8" />
        <path className="compress-lines" d="M13 27h18M13 34h18M13 41h14" />
      </g>
      <g className="compress-file compress-file-right">
        <path d="M43 9h23l8 8v39H43Z" />
        <path d="M66 9v8h8" />
        <path className="compress-lines" d="M49 27h18M49 34h18M49 41h14" />
      </g>
      <path className="compress-arrow compress-arrow-left" d="m20 50 12 7-12 7" />
      <path className="compress-arrow compress-arrow-right" d="m60 50-12 7 12 7" />
      <path className="compress-zip" d="M37 17h6v5h-6v5h6v5h-6v5h6v5h-6v5h6" />
    </svg>
  )
};

const ProjectIcon = ({ projectId }) => (
  <div
    className={`project-visual project-visual-${projectId}${projectId === 'project3' ? ' folder-icon-vader project-visual-vader' : ''}`}
    aria-hidden="true"
  >
    {projectId === 'project3' ? <VaderIcon /> : projectIcons[projectId]}
  </div>
);

export default ProjectIcon;
