import React, { useCallback, useEffect, useId, useLayoutEffect, useRef } from 'react';
import { useMobileViewport } from '../hooks/useMobileViewport';

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
  returnFocus,
  headerColor,
  replacesWindowId,
  hasCompletedEntry,
  isBeingReplaced,
  onOpened
}) => {
  const windowRef = useRef(null);
  const titlebarRef = useRef(null);
  const dragState = useRef(null);
  const previousFocusRef = useRef(null);
  const openedRef = useRef(false);
  const titleId = useId();
  const isMobile = useMobileViewport();
  const isModal = isFullscreen || isMobile;

  const notifyOpened = useCallback(() => {
    if (openedRef.current || !replacesWindowId) return;
    openedRef.current = true;
    onOpened?.(id, replacesWindowId);
  }, [id, onOpened, replacesWindowId]);

  useEffect(() => {
    openedRef.current = false;
    if (!replacesWindowId) return undefined;
    const fallbackTimer = window.setTimeout(notifyOpened, 350);
    return () => window.clearTimeout(fallbackTimer);
  }, [notifyOpened, replacesWindowId]);

  useEffect(() => {
    previousFocusRef.current = returnFocus || document.activeElement;
    if (!windowRef.current?.contains(document.activeElement)) {
      windowRef.current?.focus({ preventScroll: true });
    }
    const previousFocus = previousFocusRef.current;
    const ownWindow = windowRef.current;

    return () => {
      const shouldRestore = document.activeElement === document.body || ownWindow?.contains(document.activeElement);
      if (shouldRestore && previousFocus instanceof HTMLElement && document.contains(previousFocus)) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [returnFocus]);

  useLayoutEffect(() => {
    if (isModal) return undefined;
    const keepInView = () => {
      const node = windowRef.current;
      if (!node) return;
      const margin = 8;
      const x = Math.max(margin, Math.min(position.x, window.innerWidth - node.offsetWidth - margin));
      const y = Math.max(margin, Math.min(position.y, window.innerHeight - node.offsetHeight - margin));
      if (x !== position.x || y !== position.y) onDrag(id, { x, y });
    };
    keepInView();
    window.addEventListener('resize', keepInView);
    const observer = new ResizeObserver(keepInView);
    observer.observe(windowRef.current);
    return () => {
      window.removeEventListener('resize', keepInView);
      observer.disconnect();
    };
  }, [id, isModal, onDrag, position.x, position.y]);

  const startDrag = useCallback((event) => {
    if (
      isFullscreen ||
      event.button !== 0 ||
      event.target.closest('button') ||
      isMobile
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
  }, [isFullscreen, isMobile, onFocus]);

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
    if (isMobile) {
      onBack?.(id);
      return;
    }
    onClose();
    onBack?.();
  };

  const handleKeyDown = (event) => {
    if (event.defaultPrevented || !isModal || event.key !== 'Tab') return;
    const focusable = Array.from(windowRef.current?.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'
    ) ?? []).filter(element => element.getClientRects().length > 0);
    if (focusable.length === 0) {
      event.preventDefault();
      windowRef.current?.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === windowRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

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
      className={`window ${isFullscreen ? 'fullscreen' : ''} ${replacesWindowId ? 'is-window-replacement' : ''} ${hasCompletedEntry ? 'has-completed-entry' : ''}`}
      style={{ ...positionStyle, ...style }}
      role="dialog"
      aria-modal={isModal ? 'true' : undefined}
      aria-hidden={isBeingReplaced ? 'true' : undefined}
      inert={isBeingReplaced ? true : undefined}
      aria-labelledby={titleId}
      tabIndex={-1}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) notifyOpened();
      }}
      onPointerDown={onFocus}
      onFocusCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onFocus?.();
      }}
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
