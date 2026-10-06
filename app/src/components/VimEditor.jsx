import { useLayoutEffect, useRef, useState } from 'react';
import { VimSession, VIM_HELP } from '../windows/vimSession';
import { highlightedText } from './vimHighlight';

export default function VimEditor({ adapter, path, onExit }) {
  const [vim] = useState(() => new VimSession(adapter, path));
  const [revision, setRevision] = useState(0);
  const textRef = useRef(null);
  const commandRef = useRef(null);
  const gutterRef = useRef(null);
  const mirrorRef = useRef(null);
  const helpRef = useRef(null);
  const focusRequested = useRef(true);
  const composing = useRef(false);
  const commandMode = vim.mode === 'command' || vim.mode === 'search';
  const editing = vim.mode === 'insert' || vim.mode === 'replace';

  const refresh = (focus = true) => {
    if (vim.closed) { onExit(); return; }
    focusRequested.current = focus;
    setRevision(value => value + 1);
  };
  const act = action => {
    try { action(); } catch (error) { vim.message = error.message; vim.reset(); }
    refresh();
  };

  useLayoutEffect(() => {
    const field = vim.help ? helpRef.current : commandMode ? commandRef.current : textRef.current;
    if (focusRequested.current) field?.focus({ preventScroll: true });
    if (!commandMode && !vim.help && field && !composing.current) {
      const range = vim.mode.startsWith('visual') ? vim.selection() : null;
      const start = range?.start ?? vim.cursor;
      // A selected character makes Normal mode's block cursor visible.
      const end = range?.end ?? (editing ? start : Math.min(vim.text.length, start + 1));
      field.setSelectionRange(start, end, range && vim.cursor < vim.anchor ? 'backward' : 'forward');
      if (focusRequested.current) {
        const style = getComputedStyle(field);
        const lineHeight = parseFloat(style.lineHeight);
        const top = (vim.lineNumber() - 1) * lineHeight;
        if (top < field.scrollTop) field.scrollTop = top;
        else if (top + lineHeight > field.scrollTop + field.clientHeight - 16) field.scrollTop = top - field.clientHeight + lineHeight + 16;
        const context = document.createElement('canvas').getContext('2d');
        if (context) {
          context.font = `${style.fontSize} ${style.fontFamily}`;
          let column = 0;
          const prefix = vim.text.slice(vim.lineStart(), vim.cursor).replace(/\t|[^\t]/g, char => {
            const width = char === '\t' ? vim.tabstop - column % vim.tabstop : 1;
            column += width;
            return char === '\t' ? ' '.repeat(width) : char;
          });
          const left = context.measureText(prefix).width;
          if (left < field.scrollLeft) field.scrollLeft = left;
          else if (left + 24 > field.scrollLeft + field.clientWidth) field.scrollLeft = left - field.clientWidth + 24;
        }
        if (gutterRef.current) gutterRef.current.scrollTop = field.scrollTop;
        if (mirrorRef.current) { mirrorRef.current.scrollTop = field.scrollTop; mirrorRef.current.scrollLeft = field.scrollLeft; }
      }
    }
  }, [vim, revision, commandMode, editing]);

  const keyDown = event => {
    if (event.isComposing || composing.current || ['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) return;
    if (event.key === 'Tab' && (event.shiftKey || !editing)) return;
    if (event.metaKey || event.altKey) return;
    if (event.key === 'Tab' && editing) {
      event.preventDefault();
      const field = event.currentTarget;
      const insert = ' '.repeat(vim.tabstop);
      act(() => vim.input(vim.text.slice(0, field.selectionStart) + insert + vim.text.slice(field.selectionEnd), field.selectionStart + insert.length));
      return;
    }
    let handled = false;
    try { handled = vim.key(event.key, event.ctrlKey); }
    catch (error) { vim.message = error.message; vim.reset(); handled = true; }
    if (handled) { event.preventDefault(); refresh(); }
  };

  return (
    <div className="terminal vim-editor" onKeyDown={event => {
      if (event.key === 'Escape') {
        event.preventDefault(); event.stopPropagation();
        if (!event.isComposing) act(() => vim.key('Escape'));
      }
    }}>
      <div className="vim-toolbar" role="toolbar" aria-label="Vim controls">
        <span className="vim-brand">VIM</span>
        <button type="button" onClick={() => act(() => { vim.key('Escape'); vim.key('i'); })}>Insert</button>
        <button type="button" onClick={() => act(() => vim.key('Escape'))}>Esc</button>
        <button type="button" aria-label="Enter Vim command" onClick={() => act(() => { vim.key('Escape'); vim.key(':'); })}>:</button>
        <button type="button" onClick={() => act(() => { vim.key('Escape'); vim.execute(':w'); })}>Save</button>
        <button type="button" onClick={() => act(() => { vim.key('Escape'); vim.execute(':q'); })}>Quit</button>
        <button type="button" aria-label="Vim help" onClick={() => act(() => { vim.key('Escape'); vim.execute(':help'); })}>?</button>
      </div>
      {vim.help ? <pre className="vim-help" ref={helpRef} tabIndex={0}>{VIM_HELP}</pre> : <div className="vim-surface">
        <pre className={`vim-gutter${vim.number ? '' : ' vim-no-numbers'}`} ref={gutterRef} aria-hidden="true">{vim.text.split('\n').map((_, i) => vim.number ? i + 1 : '').join('\n')}{'\n'}<span className="vim-filler">{'~\n'.repeat(150)}</span></pre>
        <div className="vim-code-area">
        <div className="vim-mirror" ref={mirrorRef} aria-hidden="true"><pre style={{ tabSize: vim.tabstop }}>{highlightedText(vim.text, vim.buffer.path, vim.cursor, !editing && !vim.mode.startsWith('visual'))}{'\n'}</pre></div>
        <textarea
          ref={textRef} className="vim-text" aria-label={`Vim editor, ${vim.mode} mode`} tabIndex={0}
          value={vim.text} readOnly={!editing} wrap="off" spellCheck={false}
          autoCapitalize="off" autoCorrect="off" autoComplete="off" style={{ tabSize: vim.tabstop }}
          onKeyDown={keyDown}
          onChange={event => { vim.input(event.target.value, event.target.selectionStart); refresh(false); }}
          onCompositionStart={() => { composing.current = true; }}
          onCompositionEnd={() => { composing.current = false; refresh(false); }}
          onClick={event => { vim.cursor = event.currentTarget.selectionStart; if (!editing) vim.normalCursor(); refresh(false); }}
          onKeyUp={event => { if (editing && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) { vim.cursor = event.currentTarget.selectionStart; refresh(false); } }}
          onScroll={event => {
            if (gutterRef.current) gutterRef.current.scrollTop = event.currentTarget.scrollTop;
            if (mirrorRef.current) { mirrorRef.current.scrollTop = event.currentTarget.scrollTop; mirrorRef.current.scrollLeft = event.currentTarget.scrollLeft; }
          }}
        />
        </div>
      </div>}
      <div className="vim-status">
        <strong>{vim.mode === 'normal' ? '' : `-- ${vim.mode.toUpperCase().replace('-', ' ')} --`}</strong>
        <span>{vim.recording ? `recording @${vim.recording}` : `${vim.operator}${vim.count}${vim.pending}`}</span>
        <span>{vim.lineNumber()},{vim.cursor - vim.lineStart() + 1} · {vim.index + 1}/{vim.buffers.length}</span>
      </div>
      {commandMode ? <input ref={commandRef} className="vim-command" aria-label="Vim command" value={vim.command}
        autoCapitalize="off" autoCorrect="off" spellCheck={false}
        onChange={event => { vim.command = event.target.value; refresh(false); }}
        onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); act(() => vim.execute(vim.command)); } }}
      /> : <div className="vim-message" role="status">{vim.message || (vim.help ? 'Esc to return to your file' : `"${vim.buffer.path || '[No Name]'}"${vim.dirty ? ' [Modified]' : ''} ${vim.text.split('\n').length}L, ${vim.text.length}C`)}</div>}
    </div>
  );
}
