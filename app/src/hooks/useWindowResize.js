import { useCallback, useEffect, useRef, useState } from 'react';

const MARGIN = 8;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const resizeWindowBounds = (start, direction, dx, dy, viewport) => {
  let { x, y, width, height } = start;
  const right = x + width;
  const bottom = y + height;
  const minWidth = Math.min(360, width);
  const minHeight = Math.min(220, height);
  if (direction.includes('e')) width = clamp(width + dx, minWidth, viewport.width - MARGIN - x);
  if (direction.includes('s')) height = clamp(height + dy, minHeight, viewport.height - MARGIN - y);
  if (direction.includes('w')) {
    x = clamp(x + dx, MARGIN, right - minWidth);
    width = right - x;
  }
  if (direction.includes('n')) {
    y = clamp(y + dy, MARGIN, bottom - minHeight);
    height = bottom - y;
  }
  return { x, y, width, height };
};

export const useWindowResize = ({ windowRef, enabled, onResize, id, onFocus }) => {
  const [previewBounds, setPreviewBounds] = useState(null);
  const resizeState = useRef(null);
  const frame = useRef(null);

  const finishResize = useCallback((commit = true) => {
    const state = resizeState.current;
    if (!state) return;
    resizeState.current = null;
    cancelAnimationFrame(frame.current);
    frame.current = null;
    if (state.handle.hasPointerCapture(state.pointerId)) state.handle.releasePointerCapture(state.pointerId);
    document.body.classList.remove('is-resizing-window');
    document.body.style.removeProperty('--window-resize-cursor');
    setPreviewBounds(null);
    if (commit) onResize(id, state.bounds);
  }, [id, onResize]);

  useEffect(() => {
    if (!enabled) return undefined;
    const stop = () => finishResize();
    // Finish before viewport geometry changes; CSS then caps the saved size.
    window.addEventListener('blur', stop);
    window.addEventListener('resize', stop);
    return () => {
      window.removeEventListener('blur', stop);
      window.removeEventListener('resize', stop);
      finishResize(false);
    };
  }, [enabled, finishResize]);

  const startResize = (event, direction) => {
    if (!enabled || event.button !== 0 || resizeState.current) return;
    event.preventDefault();
    event.stopPropagation();
    const rect = windowRef.current.getBoundingClientRect();
    const bounds = { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    resizeState.current = {
      start: bounds, bounds, direction,
      pointerId: event.pointerId, handle: event.currentTarget,
      clientX: event.clientX, clientY: event.clientY
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    (direction === 'se' ? event.currentTarget : windowRef.current).focus({ preventScroll: true });
    onFocus?.();
    document.body.classList.add('is-resizing-window');
    document.body.style.setProperty('--window-resize-cursor', `${direction}-resize`);
    setPreviewBounds(bounds);
  };

  const moveResize = event => {
    const state = resizeState.current;
    if (!state || state.pointerId !== event.pointerId) return;
    state.bounds = resizeWindowBounds(state.start, state.direction,
      event.clientX - state.clientX, event.clientY - state.clientY,
      { width: window.innerWidth, height: window.innerHeight });
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      if (resizeState.current) setPreviewBounds(resizeState.current.bounds);
    });
  };

  const stopResize = event => {
    if (resizeState.current?.pointerId !== event.pointerId) return;
    if (event.type === 'pointerup') moveResize(event);
    finishResize();
  };

  const resizeWithKeyboard = event => {
    if (!enabled || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    const rect = windowRef.current.getBoundingClientRect();
    const step = event.shiftKey ? 40 : 10;
    const dx = event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0;
    const dy = event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0;
    onResize(id, resizeWindowBounds(rect, 'se', dx, dy, { width: window.innerWidth, height: window.innerHeight }));
  };

  return { previewBounds, resizeState, startResize, moveResize, stopResize, resizeWithKeyboard };
};
