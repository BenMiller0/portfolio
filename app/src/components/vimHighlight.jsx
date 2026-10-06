// Render text, never HTML. Unknown extensions stay plain terminal text.
export function highlightedText(text, path, cursor, block) {
  const code = /\.(py|js|jsx|ts|tsx|c|cpp|h|java|json|sh|css)$/i.test(path);
  const tokens = code ? [...text.matchAll(/(#[^\n]*|\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|\b(True|False|None|true|false|null|undefined|print|console)\b|\b(def|class|if|else|elif|return|for|while|import|from|const|let|var|function|export|async|await|new|try|catch|int|void|include)\b|\b(\d+(?:\.\d+)?)\b/g)] : [];
  const pieces = [];
  const add = (value, start, className = '') => {
    if (block && cursor >= start && cursor < start + value.length) {
      const at = cursor - start;
      pieces.push(<span key={start} className={className}>{value.slice(0, at)}<span className="vim-block">{value[at] === '\n' ? ' ' : value[at]}</span>{value[at] === '\n' ? '\n' : ''}{value.slice(at + 1)}</span>);
    } else pieces.push(<span key={start} className={className}>{value}</span>);
  };
  let end = 0;
  for (const token of tokens) {
    if (token.index > end) add(text.slice(end, token.index), end);
    add(token[0], token.index, `vim-syntax-${token[1] ? 'comment' : token[2] ? 'string' : token[3] ? 'builtin' : token[4] ? 'keyword' : 'number'}`);
    end = token.index + token[0].length;
  }
  if (end < text.length) add(text.slice(end), end);
  if (block && cursor === text.length) pieces.push(<span key="cursor" className="vim-block"> </span>);
  return pieces;
}
