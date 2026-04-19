import React, { useRef, useEffect, useCallback } from 'react';

const MOBILE_BREAKPOINT = 768;

const HEADER_COLOR_MAP = {
  'lightgreen': 'window-header-green',
  'orange': 'window-header-orange',
  '#f2f2f2': 'window-header-gray',
  '#cc3333': 'window-header-red'
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

  const getHeaderClassName = () => HEADER_COLOR_MAP[headerColor] || 'window-header';

  const bringToFrontImmediate = useCallback(() => {
    if (!windowRef.current) return;
    
    const windows = document.querySelectorAll('.window');
    const highestZ = Math.max(...Array.from(windows).map(w => parseInt(w.style.zIndex || 0)));
    const newZIndex = highestZ + 1;
    
    windowRef.current.style.zIndex = newZIndex;
    currentZIndex.current = newZIndex;
    
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

  const stopDrag = useCallback(() => { isDragging.current = false; }, []);

  const handleMouseMove = useCallback((e) => moveDrag(e.clientX, e.clientY), [moveDrag]);
  
  const handleMouseUp = useCallback(() => {
    stopDrag();
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [stopDrag, handleMouseMove]);

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0 || isFullscreen) return;
    
    bringToFrontImmediate();
    startDrag(e.clientX, e.clientY);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [isFullscreen, bringToFrontImmediate, startDrag, handleMouseMove, handleMouseUp]);

  const handleTouchMove = useCallback((e) => {
    const touch = e.touches[0];
    moveDrag(touch.clientX, touch.clientY);
  }, [moveDrag]);

  const handleTouchEnd = useCallback(() => {
    stopDrag();
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  }, [stopDrag, handleTouchMove]);

  const handleTouchStart = useCallback((e) => {
    if (isFullscreen) return;
    
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    if (isMobile) return;
    
    bringToFrontImmediate();
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  }, [isFullscreen, bringToFrontImmediate, startDrag, handleTouchMove, handleTouchEnd]);

  const stopPropagation = (e) => e.stopPropagation();

  const handleBackClick = useCallback((e) => {
    stopPropagation(e);
    onClose();
    onBack();
  }, [onClose, onBack]);

  const handleFullscreenClick = useCallback((e) => {
    stopPropagation(e);
    onToggleFullscreen?.();
  }, [onToggleFullscreen]);

  const handleCloseClick = useCallback((e) => {
    stopPropagation(e);
    onClose();
  }, [onClose]);

  const windowStyle = isFullscreen ? {} : {
    left: `${position.x}px`,
    top: `${position.y}px`,
    position: 'absolute'
  };

  return (
    <div
      ref={windowRef}
      data-window-id={id}
      className={`window ${isFullscreen ? 'fullscreen' : ''}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={windowStyle}
    >
      <div className={getHeaderClassName()}>
        {onBack && (
          <button 
            className="back-button" 
            onClick={handleBackClick}
            onTouchEnd={stopPropagation}
          >
            ← Back
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
            {isFullscreen ? '⤢' : '⛶'}
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
