export const MOBILE_BREAKPOINT = 768;

export const WINDOW_LAYOUT = {
  mobileWidthPercent: 0.9,
  mobileMaxWidth: 500,
  mobileStartY: 140,
  desktopWidthPercent: 0.6,
  desktopMaxWidth: 600,
  desktopHeightPercent: 0.7,
  desktopMaxHeight: 500,
  desktopStartY: 80,
  minY: 50,
  offset: 30
};

export const isMobileViewport = () => window.innerWidth < MOBILE_BREAKPOINT;

export const getCenteredWindowX = (widthPercent, maxWidth) => {
  const estimatedWidth = Math.min(window.innerWidth * widthPercent, maxWidth);
  return (window.innerWidth - estimatedWidth) / 2;
};

export const calculateWindowPosition = (windowCount, isFullscreen = false) => {
  if (isFullscreen) return { x: 0, y: 0 };

  const mobile = isMobileViewport();
  const startX = mobile
    ? getCenteredWindowX(WINDOW_LAYOUT.mobileWidthPercent, WINDOW_LAYOUT.mobileMaxWidth)
    : getCenteredWindowX(WINDOW_LAYOUT.desktopWidthPercent, WINDOW_LAYOUT.desktopMaxWidth);
  const startY = mobile ? WINDOW_LAYOUT.mobileStartY : WINDOW_LAYOUT.desktopStartY;
  const offset = windowCount * WINDOW_LAYOUT.offset;

  return {
    x: Math.max(0, startX + offset),
    y: Math.max(WINDOW_LAYOUT.minY, startY + offset)
  };
};

export const calculateRestorePosition = () => {
  if (isMobileViewport()) {
    return {
      x: Math.max(0, getCenteredWindowX(WINDOW_LAYOUT.mobileWidthPercent, WINDOW_LAYOUT.mobileMaxWidth)),
      y: WINDOW_LAYOUT.mobileStartY
    };
  }

  const x = getCenteredWindowX(WINDOW_LAYOUT.desktopWidthPercent, WINDOW_LAYOUT.desktopMaxWidth);
  const estimatedHeight = Math.min(
    window.innerHeight * WINDOW_LAYOUT.desktopHeightPercent,
    WINDOW_LAYOUT.desktopMaxHeight
  );

  return {
    x: Math.max(0, x),
    y: Math.max(WINDOW_LAYOUT.minY, (window.innerHeight - estimatedHeight) / 2)
  };
};
