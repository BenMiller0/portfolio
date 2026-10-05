import { useId } from 'react';
import '../assets/featured-project-icons.css';

// Each instance owns its paint servers, including when an icon appears twice.
export const VaderIcon = () => {
  const id = useId();
  return (
    <svg className="featured-icon vader-scene" viewBox="0 0 80 64" focusable="false">
      <defs>
        <linearGradient id={`${id}-steel`} x1="0" y1="0" x2="1" y2=".7">
          <stop stopColor="var(--vader-metal-light)" /><stop offset=".32" stopColor="var(--vader-metal-mid)" />
          <stop offset=".55" stopColor="var(--vader-metal-dark)" /><stop offset="1" stopColor="var(--vader-metal-edge)" />
        </linearGradient>
        <linearGradient id={`${id}-cape`}>
          <stop stopColor="var(--vader-cape-dark)" /><stop offset=".48" stopColor="var(--vader-cape-light)" /><stop offset="1" stopColor="#080c14" />
        </linearGradient>
        <radialGradient id={`${id}-aura`}>
          <stop stopColor="#ff405c" stopOpacity=".35" /><stop offset="1" stopColor="#ff405c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse className="vader-aura" cx="40" cy="35" rx="38" ry="29" fill={`url(#${id}-aura)`} />
      <g className="vader-bust">
        <path d="M5 61 11 46Q15 39 29 37H51Q65 39 69 46L75 61Q40 65 5 61Z" fill={`url(#${id}-cape)`} stroke="#66778c" strokeWidth=".8" />
        <path d="m15 59 6-15m44 15-6-15M24 60l4-19m28 19-4-19" stroke="#77869a" strokeOpacity=".3" fill="none" />
        <path d="m23 43 9-5h16l9 5-7 7H30Z" fill={`url(#${id}-steel)`} stroke="#7f8c9c" strokeWidth=".7" />
        <path d="M18 37 23 21C23 9 30 3 40 3s17 6 17 18l5 16-11 7H29Z" fill={`url(#${id}-steel)`} stroke="#97a5b7" strokeWidth=".9" strokeLinejoin="round" />
        <path d="M27 20Q27 7 39 6M24 28l-3 8" className="vader-rim" fill="none" stroke="#d4e4f6" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M41 5v15" fill="none" stroke="#a8b6c9" strokeOpacity=".45" strokeWidth="1.3" />
        <path d="m27 23 13-5 13 5-3 14-10 7-10-7Z" fill="#121923" stroke="#6d7e94" strokeWidth=".7" />
        <path d="m27 24 11-3-2 7-8 1Zm26 0-11-3 2 7 8 1Z" fill="#03070d" stroke="#93a3b9" strokeWidth=".8" strokeLinejoin="round" />
        <path d="m28 30 7-2-4 8Zm24 0-7-2 4 8Z" fill="#718096" opacity=".65" />
        <path d="m40 23 3 9h-6Z" fill="#8996a8" />
        <path d="m40 31 9 10H31Z" fill="#04070c" stroke="#a5b2c3" strokeWidth=".85" strokeLinejoin="round" />
        <path d="M36 37v3m2-5v5m2-7v7m2-5v5m2-3v3" stroke="#9ba8b9" strokeWidth=".85" />
        <circle cx="29" cy="39" r="2" fill="#b5c1cd" /><circle cx="51" cy="39" r="2" fill="#b5c1cd" />
        <circle cx="29" cy="39" r=".9" fill="#1e2835" /><circle cx="51" cy="39" r=".9" fill="#1e2835" />
        <g className="vader-console" transform="translate(-6 -8) scale(1.15)">
          <rect x="31" y="46" width="18" height="12" rx="1.4" fill="#070d15" stroke="#98a8bb" strokeWidth=".8" />
          <path d="M33 48v8m14-8v8M35 48.5h4m-4 2.2h4m-4 2.2h4" stroke="#c5cbd1" strokeWidth=".8" />
          <rect className="vader-led vader-led-blue" x="41.6" y="47.7" width="3.8" height="2.8" rx=".3" />
          <rect className="vader-led vader-led-red" x="41.6" y="51" width="3.8" height="2.8" rx=".3" />
          <path className="vader-led vader-led-white" d="M35 55.5h2" stroke="currentColor" strokeWidth="2" />
          <path className="vader-led vader-led-white vader-led-offset" d="M38 55.5h2" stroke="currentColor" strokeWidth="2" />
          <path className="vader-led vader-led-white" d="M41 55.5h2" stroke="currentColor" strokeWidth="2" />
          <path className="vader-led vader-led-red vader-led-offset" d="M44 55.5h1" stroke="currentColor" strokeWidth="2" />
        </g>
        <path d="M18 60h44" stroke="#0a101b" strokeWidth="4" />
        <g className="vader-speaker">
          <rect x="34" y="57.5" width="12" height="5" rx=".6" />
          <circle cx="37" cy="60" r="1.7" />
          <path d="M40 59.5v1m1.5-2v3m1.5-3.5v4" />
        </g>
        <g stroke="#768291" strokeWidth=".5" fill="#0b1119">
          <rect x="19" y="56" width="13" height="7" rx=".7" />
          <rect x="48" y="56" width="13" height="7" rx=".7" />
        </g>
        <path className="vader-led vader-led-green" d="M24.8 56.8h3v3h-3ZM52.3 56.8h3v3h-3Z" />
        <path className="vader-led vader-led-green vader-led-offset" d="M28.3 56.8h3v3h-3ZM48.8 56.8h3v3h-3Z" />
        <circle className="vader-led vader-led-red" cx="23" cy="58.5" r="1.5" />
        <circle className="vader-led vader-led-red vader-led-offset" cx="57" cy="58.5" r="1.5" />
        <path d="M25 61h5m20 0h5" stroke="#e0e3e6" strokeWidth="1" />
        <path d="M21 58v3m38-3v3" stroke="#aeb8c3" strokeWidth="1.2" strokeDasharray=".5 1" />
      </g>
      <g className="vader-audio-waves" fill="none" strokeLinecap="round">
        <path d="M65 31q4 4 0 8" />
        <path d="M69 28q7 7 0 14" />
        <path d="M73 25q10 10 0 20" />
      </g>
      <g className="vader-audio-waves" fill="none" strokeLinecap="round" transform="translate(80 0) scale(-1 1)">
        <path d="M65 31q4 4 0 8" />
        <path d="M69 28q7 7 0 14" />
        <path d="M73 25q10 10 0 20" />
      </g>
    </svg>
  );
};

export const BirdIcon = () => {
  const id = useId();
  return (
    <svg className="featured-icon taro-scene" viewBox="0 0 80 64" focusable="false">
      <defs>
        <linearGradient id={`${id}-feathers`} x2=".8" y2="1">
          <stop stopColor="var(--bird-feather-light)" /><stop offset=".5" stopColor="var(--bird-feather-mid)" /><stop offset="1" stopColor="var(--bird-feather-dark)" />
        </linearGradient>
        <linearGradient id={`${id}-beak`} x2=".9" y2=".7">
          <stop stopColor="var(--bird-beak-light)" /><stop offset=".5" stopColor="var(--bird-beak-mid)" /><stop offset=".82" stopColor="var(--bird-beak-warm)" /><stop offset="1" stopColor="var(--bird-beak-tip)" />
        </linearGradient>
      </defs>
      <path d="M14 60q2-19 21-22 20 2 25 22-21 7-46 0Z" fill={`url(#${id}-feathers)`} stroke="#8790a6" strokeWidth=".8" />
      <path d="m29 43 4 6 4-6 4 6 4-6" stroke="#b5a4c1" strokeOpacity=".6" fill="none" />
      <g className="taro-wing-unit">
        <path d="M26 44Q13 39 8 47l4 2-5 4 7 1-5 4q15 7 26 1Z" fill="var(--bird-wing)" stroke="#7d879e" strokeWidth=".8" strokeLinejoin="round" />
        <path d="m14 48 12 5m-11 0 13 4m-11 0 11 2" stroke="#9299ae" strokeOpacity=".55" fill="none" strokeLinecap="round" />
      </g>
      <g className="taro-head-unit">
        <g className="taro-plumes" fill="none" stroke="var(--bird-crest)" strokeWidth="2.8" strokeLinecap="round">
          <path d="M28 13Q22 4 16 7M31 12Q28 3 32 2" />
        </g>
        <path d="M15 29C14 16 23 9 36 9c14 0 24 8 24 21 0 12-10 19-24 19-13 0-21-8-21-20Z" fill={`url(#${id}-feathers)`} stroke="#a5a0b6" strokeWidth=".9" />
        <path d="M20 23q3-9 13-10" fill="none" stroke="#d4c8e2" strokeOpacity=".45" strokeWidth="1.3" strokeLinecap="round" />
        <ellipse cx="33" cy="28" rx="13" ry="15" fill="var(--bird-cheek)" opacity=".5" />
        <g className="taro-eye-lid">
          <ellipse cx="51" cy="20" rx="6.5" ry="7.5" fill="var(--bird-eye)" stroke="#d6c9de" strokeWidth=".7" />
          <g className="taro-pupil">
            <ellipse cx="52" cy="20" rx="4" ry="5.1" fill="#151c2c" />
            <circle cx="50.8" cy="18.2" r="1.4" fill="white" /><circle cx="53.5" cy="22" r=".6" fill="#b3cfe4" />
          </g>
        </g>
        <g className="taro-eye-lid">
          <ellipse cx="32" cy="26" rx="9" ry="10" fill="var(--bird-eye)" stroke="#d6c9de" strokeWidth=".7" />
          <g className="taro-pupil">
            <ellipse cx="34" cy="26" rx="5.7" ry="6.8" fill="#151c2c" />
            <circle cx="32.3" cy="23.5" r="2" fill="white" /><circle cx="36" cy="28.5" r=".8" fill="#b3cfe4" />
          </g>
        </g>
        <path d="M44 32q14-3 25 3-7 10-23 5Z" fill="#211e30" />
        <g className="taro-jaw">
          <path d="M45 35q13 2 24 0-5 10-22 6Z" fill="var(--bird-jaw)" stroke="var(--bird-beak-edge)" strokeWidth=".7" />
          <path d="M48 39q8 3 15 0" fill="none" stroke="#89623b" strokeWidth="1" />
        </g>
        <path d="M43 24q9-6 19 0 10 5 12 14-7-4-13-3l-18 1Z" fill={`url(#${id}-beak)`} stroke="var(--bird-beak-edge)" strokeWidth=".8" strokeLinejoin="round" />
        <path d="M64 28q9 3 10 10l-9-3Z" fill="#303144" stroke="#626074" strokeWidth=".6" />
        <path d="M47 25q7-3 13 1" fill="none" stroke="#fff0bd" strokeWidth="1.2" strokeLinecap="round" opacity=".8" />
        <circle cx="49" cy="28" r="1" fill="#7a5a48" />
        <path d="m21 36 3 3m0-4 3 3" stroke="#b5a4c1" strokeOpacity=".55" strokeLinecap="round" />
      </g>
    </svg>
  );
};

export const WandIcon = () => {
  const id = useId();
  return (
    <svg className="featured-icon spell-scene" viewBox="0 0 80 64" focusable="false">
      <defs>
        <radialGradient id={`${id}-magic`}>
          <stop stopColor="var(--magic-core)" stopOpacity=".5" /><stop offset=".45" stopColor="#a575ff" stopOpacity=".18" /><stop offset="1" stopColor="#9861ef" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-wood`} x1="0" y1="1" x2="1" y2="0">
          <stop stopColor="var(--wand-wood-dark)" /><stop offset=".5" stopColor="var(--wand-wood-mid)" /><stop offset="1" stopColor="var(--wand-wood-light)" />
        </linearGradient>
        <linearGradient id={`${id}-trail`}>
          <stop stopColor="var(--magic-trail-start)" stopOpacity="0" /><stop offset=".45" stopColor="var(--magic-trail-mid)" /><stop offset="1" stopColor="var(--magic-trail-end)" />
        </linearGradient>
      </defs>
      <circle className="spell-aura" cx="47" cy="27" r="30" fill={`url(#${id}-magic)`} />
      <ellipse cx="45" cy="29" rx="25" ry="18" transform="rotate(-25 45 29)" fill="none" stroke="#b69ae7" strokeOpacity=".18" strokeWidth=".8" />
      <path className="spell-ribbon spell-ribbon-soft" d="M17 44C26 57 69 41 67 25 65 13 40 16 47 27" stroke={`url(#${id}-trail)`} />
      <path className="spell-ribbon" d="M17 44C26 57 69 41 67 25 65 13 40 16 47 27" stroke={`url(#${id}-trail)`} pathLength="100" />
      <g className="spell-cast-unit">
        <path d="m13 56 5 3 32-37-2-2Z" fill={`url(#${id}-wood)`} stroke="#e7bd8b" strokeWidth=".65" strokeLinejoin="round" />
        <path d="m12 56 5 4 12-15-5-4Z" fill="var(--wand-handle)" stroke="#d9a26c" strokeWidth=".85" strokeLinejoin="round" />
        <path d="m15 54 5 3m-2-6 5 3m-2-6 5 3m-2-6 4 3" stroke="#d3a076" strokeWidth="1.3" />
        <path d="m29 42 17-19" stroke="#fff0c7" strokeWidth=".9" strokeLinecap="round" opacity=".8" />
        <g className="spell-tip">
          <circle cx="49" cy="21" r="9" fill={`url(#${id}-magic)`} />
          <path d="m49 12 2 7 7 2-7 2-2 7-2-7-7-2 7-2Z" fill="var(--magic-star)" />
          <circle cx="49" cy="21" r="2.2" fill="white" />
        </g>
      </g>
      <g className="spell-spark spell-spark-one" fill="#b9f7ff"><path d="m66 8 1.3 4.7L72 14l-4.7 1.3L66 20l-1.3-4.7L60 14l4.7-1.3Z" /></g>
      <g className="spell-spark spell-spark-two" fill="#e3c1ff"><path d="m30 10 1 3 3 1-3 1-1 3-1-3-3-1 3-1Z" /></g>
      <g className="spell-spark spell-spark-three" fill="#ffe3a3"><path d="m64 43 1 3 3 1-3 1-1 3-1-3-3-1 3-1Z" /></g>
      <g className="spell-dust" fill="#e6d5ff"><circle cx="38" cy="7" r="1" /><circle cx="73" cy="29" r="1.2" /><circle cx="37" cy="51" r="1" /></g>
    </svg>
  );
};
