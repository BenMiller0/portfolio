import React, { useCallback, useEffect, useId, useRef } from 'react';
import { MOBILE_BREAKPOINT } from '../constants/windowLayout';

const HEADER_COLOR_MAP = {
  lightgreen: 'window-header-green',
  orange: 'window-header-orange',
  '#f2f2f2': 'window-header-gray',
  '#cc3333': 'window-header-red',
  '#a78bfa': 'window-header-about',
  '#fb7185': 'window-header-readme',
  '#facc15': 'window-header-experience',
  '#333': 'window-header-gray'
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
  const titlebarRef = useRef(null);
  const dragState = useRef(null);
  const previousFocusRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    previousFocusRef.current = document.activeElement;
    windowRef.current?.focus({ preventScroll: true });
    const previousFocus = previousFocusRef.current;

    return () => {
      if (previousFocus instanceof HTMLElement && document.contains(previousFocus)) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, []);

  const startDrag = useCallback((event) => {
    if (
      isFullscreen ||
      event.button !== 0 ||
      event.target.closest('button') ||
      window.innerWidth < MOBILE_BREAKPOINT
    ) return;

    const rect = windowRef.current?.getBoundingClientRect();
    if (!rect) return;

    event.stopPropagation();
    onFocus?.();
    dragState.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
      height: rect.height
    };
    titlebarRef.current?.setPointerCapture(event.pointerId);
    windowRef.current?.classList.add('is-dragging');
  }, [isFullscreen, onFocus]);

  const moveDrag = useCallback((event) => {
    if (!dragState.current || dragState.current.pointerId !== event.pointerId) return;

    const margin = 10;
    const maxX = Math.max(margin, window.innerWidth - dragState.current.width - margin);
    const maxY = Math.max(margin, window.innerHeight - dragState.current.height - margin);
    onDrag(id, {
      x: Math.min(maxX, Math.max(margin, event.clientX - dragState.current.offsetX)),
      y: Math.min(maxY, Math.max(margin, event.clientY - dragState.current.offsetY))
    });
  }, [id, onDrag]);

  const stopDrag = useCallback((event) => {
    if (!dragState.current || dragState.current.pointerId !== event.pointerId) return;
    if (titlebarRef.current?.hasPointerCapture(event.pointerId)) {
      titlebarRef.current.releasePointerCapture(event.pointerId);
    }
    dragState.current = null;
    windowRef.current?.classList.remove('is-dragging');
  }, []);

  const handleBack = (event) => {
    event.stopPropagation();
    onClose();
    onBack?.();
  };

  const handleKeyDown = (event) => {
    if (!isFullscreen || event.key !== 'Tab') return;
    const focusable = Array.from(windowRef.current?.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'
    ) ?? []);
    if (focusable.length === 0) {
      event.preventDefault();
      windowRef.current?.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  const positionStyle = isFullscreen ? {} : (isMobile ? {
    left: '50%',
    transform: 'translateX(-50%)',
    top: '72px',
    position: 'fixed'
  } : {
    left: `${position.x}px`,
    top: `${position.y}px`,
    position: 'absolute'
  });

  const headerClass = HEADER_COLOR_MAP[headerColor] || 'window-header';

  return (
    <section
      ref={windowRef}
      data-window-id={id}
      className={`window ${isFullscreen ? 'fullscreen' : ''}`}
      style={{ ...positionStyle, ...style }}
      role="dialog"
      aria-modal={isFullscreen ? 'true' : undefined}
      aria-labelledby={titleId}
      tabIndex={-1}
      onPointerDown={onFocus}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={titlebarRef}
        className={`window-titlebar ${headerClass}`}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onDoubleClick={onToggleFullscreen}
      >
        <div className="window-title-group">
          {onBack && (
            <button className="back-button" type="button" onClick={handleBack} aria-label="Back">
              ‹
            </button>
          )}
          <span className="window-title" id={titleId}>{title}</span>
        </div>
        <div className="window-controls" onDoubleClick={(event) => event.stopPropagation()}>
          <button
            className="fullscreen-button"
            type="button"
            onClick={(event) => { event.stopPropagation(); onToggleFullscreen?.(); }}
            aria-label={isFullscreen ? 'Restore window' : 'Enter fullscreen'}
            title={isFullscreen ? 'Restore' : 'Fullscreen'}
          >
            <span aria-hidden="true">{isFullscreen ? '❐' : '□'}</span>
          </button>
          <button
            className="close-button"
            type="button"
            onClick={(event) => { event.stopPropagation(); onClose(); }}
            aria-label={`Close ${title}`}
            title="Close"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </div>
      <div className="window-content">{children}</div>
    </section>
  );
};

export default Window;
