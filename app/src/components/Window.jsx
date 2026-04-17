import React, { useRef, useEffect } from 'react';

const Window = ({ id, title, children, onClose, position, onDrag, onFocus, style, onBack, isFullscreen, onToggleFullscreen, headerColor }) => {
  const windowRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const currentZIndex = useRef(style.zIndex || 100);

  useEffect(() => {
    if (windowRef.current) {
      windowRef.current.style.zIndex = currentZIndex.current;
    }
  }, []);

  const getHeaderClassName = () => {
    if (!headerColor) return 'window-header';
    const colorMap = {
      'lightgreen': 'window-header-green',
      'orange': 'window-header-orange',
      '#f2f2f2': 'window-header-gray',
      '#cc3333': 'window-header-red'
    };
    return colorMap[headerColor] || 'window-header';
  };

  const bringToFrontImmediate = () => {
    if (windowRef.current) {
      const windows = document.querySelectorAll('.window');
      const highestZ = Math.max(...Array.from(windows).map(w => parseInt(w.style.zIndex || 0)));
      const newZIndex = highestZ + 1;
      
      windowRef.current.style.zIndex = newZIndex;
      currentZIndex.current = newZIndex;
      
      if (onFocus) {
        onFocus();
      }
    }
  };

  const startDrag = (clientX, clientY) => {
    if (!windowRef.current) return;
    const rect = windowRef.current.getBoundingClientRect();
    offset.current = { x: clientX - rect.left, y: clientY - rect.top };
    isDragging.current = true;
  };

  const moveDrag = (clientX, clientY) => {
    if (!isDragging.current) return;
    onDrag(id, { x: clientX - offset.current.x, y: clientY - offset.current.y });
  };

  const stopDrag = () => { isDragging.current = false; };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    if (isFullscreen) return;
    bringToFrontImmediate();
    startDrag(e.clientX, e.clientY);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => moveDrag(e.clientX, e.clientY);
  const handleMouseUp = () => {
    stopDrag();
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e) => {
    if (isFullscreen) return;
    const isMobile = window.innerWidth < 768;
    if (isMobile) return; // Disable drag on mobile
    bringToFrontImmediate();
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    moveDrag(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    stopDrag();
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };

  return (
    <div
      ref={windowRef}
      data-window-id={id}
      className={`window ${isFullscreen ? 'fullscreen' : ''}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          bringToFrontImmediate();
        }
      }}
      style={isFullscreen ? {} : { 
        left: `${position.x}px`, 
        top: `${position.y}px`, 
        position: 'absolute'
      }}
    >
      <div className={getHeaderClassName()}>
        {onBack && <button className="back-button" onClick={(e) => { e.stopPropagation(); onClose(); onBack(); }} onTouchEnd={(e) => e.stopPropagation()}>← Back</button>}
        <span>{title}</span>
        <div className="window-controls">
          <button className="fullscreen-button" onClick={(e) => { e.stopPropagation(); onToggleFullscreen && onToggleFullscreen(); }} onTouchEnd={(e) => e.stopPropagation()}>
            {isFullscreen ? '⤢' : '⛶'}
          </button>
          <button className="close-button" onClick={(e) => { e.stopPropagation(); onClose(); }} onTouchEnd={(e) => e.stopPropagation()} aria-label="Close window">&times;</button>
        </div>
      </div>
      <div className="window-content" onClick={(e) => {
        if (e.target === e.currentTarget) {
          bringToFrontImmediate();
        }
      }}>
        {children}
      </div>
    </div>
  );
};

export default Window;
