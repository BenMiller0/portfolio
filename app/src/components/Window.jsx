import React, { useCallback, useEffect, useRef } from 'react';
import { MOBILE_BREAKPOINT } from '../constants/windowLayout';

const HEADER_COLOR_MAP = {
  lightgreen: 'window-header-green',
  orange: 'window-header-orange',
  '#f2f2f2': 'window-header-gray',
  '#cc3333': 'window-header-red',
  '#a78bfa': 'window-header-about',
  '#fb7185': 'window-header-readme',
  '#facc15': 'window-header-experience'
};

const Window = ({
  id,
  title,
  children,
  onClose,
  position,
  onDrag,
  onFocus,
  style,
  onBack,
  isFullscreen,
  onToggleFullscreen,
  headerColor
}) => {
  const windowRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const currentZIndex = useRef(style?.zIndex || 100);

  useEffect(() => {
    if (windowRef.current) {
      windowRef.current.style.zIndex = currentZIndex.current;
    }
  }, []);

  const bringToFrontImmediate = useCallback(() => {
    if (!windowRef.current) return;

    const windows = document.querySelectorAll('.window');
    const highestZIndex = Math.max(...Array.from(windows).map(win => Number.parseInt(win.style.zIndex || 0, 10)));
    const nextZIndex = highestZIndex + 1;

    windowRef.current.style.zIndex = nextZIndex;
    currentZIndex.current = nextZIndex;
    onFocus?.();
  }, [onFocus]);

  const startDrag = useCallback((clientX, clientY) => {
    if (!windowRef.current) return;

    const rect = windowRef.current.getBoundingClientRect();
    offset.current = { x: clientX - rect.left, y: clientY - rect.top };
    isDragging.current = true;
  }, []);

  const moveDrag = useCallback((clientX, clientY) => {
    if (!isDragging.current) return;

    onDrag(id, { x: clientX - offset.current.x, y: clientY - offset.current.y });
  }, [id, onDrag]);

  const stopDrag = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleMouseMove = useCallback((event) => {
    moveDrag(event.clientX, event.clientY);
  }, [moveDrag]);

  const handleMouseUp = useCallback(() => {
    stopDrag();
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove, stopDrag]);

  const handleMouseDown = useCallback((event) => {
    if (event.button !== 0 || isFullscreen) return;

    bringToFrontImmediate();
    startDrag(event.clientX, event.clientY);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [bringToFrontImmediate, handleMouseMove, handleMouseUp, isFullscreen, startDrag]);

  const handleTouchMove = useCallback((event) => {
    const touch = event.touches[0];
    moveDrag(touch.clientX, touch.clientY);
  }, [moveDrag]);

  const handleTouchEnd = useCallback(() => {
    stopDrag();
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  }, [handleTouchMove, stopDrag]);

  const handleTouchStart = useCallback((event) => {
    if (isFullscreen || window.innerWidth < MOBILE_BREAKPOINT) return;

    bringToFrontImmediate();
    const touch = event.touches[0];
    startDrag(touch.clientX, touch.clientY);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  }, [bringToFrontImmediate, handleTouchMove, handleTouchEnd, isFullscreen, startDrag]);

  const stopPropagation = (event) => event.stopPropagation();

  const handleBackClick = useCallback((event) => {
    stopPropagation(event);
    onClose();
    onBack();
  }, [onBack, onClose]);

  const handleFullscreenClick = useCallback((event) => {
    stopPropagation(event);
    onToggleFullscreen?.();
  }, [onToggleFullscreen]);

  const handleCloseClick = useCallback((event) => {
    stopPropagation(event);
    onClose();
  }, [onClose]);

  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  const positionStyle = isFullscreen ? {} : (isMobile ? {
    left: '50%',
    transform: 'translateX(-50%)',
    top: '100px',
    position: 'absolute'
  } : {
    left: `${position.x}px`,
    top: `${position.y}px`,
    position: 'absolute'
  });

  return (
    <div
      ref={windowRef}
      data-window-id={id}
      className={`window ${isFullscreen ? 'fullscreen' : ''}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{ ...positionStyle, ...style }}
    >
      <div className={HEADER_COLOR_MAP[headerColor] || 'window-header'}>
        {onBack && (
          <button
            className="back-button"
            onClick={handleBackClick}
            onTouchEnd={stopPropagation}
          >
            &lt; Back
          </button>
        )}
        <span>{title}</span>
        <div className="window-controls">
          <button
            className="fullscreen-button"
            onClick={handleFullscreenClick}
            onTouchEnd={stopPropagation}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
          </button>
          <button
            className="close-button"
            onClick={handleCloseClick}
            onTouchEnd={stopPropagation}
            aria-label="Close window"
          >
            &times;
          </button>
        </div>
      </div>
      <div className="window-content">
        {children}
      </div>
    </div>
  );
};

export default Window;
