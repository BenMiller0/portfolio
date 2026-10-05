import { useSyncExternalStore } from 'react';
import { isMobileViewport, MOBILE_BREAKPOINT } from '../constants/windowLayout';

const subscribe = onChange => {
  const query = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

export const useMobileViewport = () => useSyncExternalStore(subscribe, isMobileViewport);
