// A browser-native modal editor. All file access is supplied by the virtual terminal.
const clamp = (n, low, high) => Math.max(low, Math.min(n, high));
const wordKind = (char, big = false) => !char || /\s/.test(char) ? 0 : big || /[\w]/.test(char) ? 1 : 2;
const unquote = text => text.replace(/^["']|["']$/g, '');

export const VIM_HELP = `Portfolio Vim — built into this terminal

MODES
  i a I A     Insert before/after cursor, at first text/end of line
  o O         Open a line below/above       R  Replace mode
  Esc         Return to Normal mode (does not close Terminal)
  v V         Visual character/line selection

MOVEMENT (prefix with a count, e.g. 5j or 2dw)
  h j k l     Left/down/up/right           Arrow keys also work
  w b e       Word forward/back/end       W B E  whitespace words
  0 ^ $       Line start/first text/end   gg G  First/last line
  12G         Go to line 12               Ctrl-d/u  Half page
  fX FX tX TX Find/to character X          ; ,  Repeat/reverse find
  %           Matching bracket            ma 'a  Set/jump to mark

EDITING
  d c y       Delete/change/yank + motion: dw, c$, yG, d2j
  dd cc yy    Delete/change/yank lines     x X  Delete character
  iw aw       Inner/around word, after operator or in Visual mode
  i" a"       Inner/around quotes (also single quotes and backticks)
  i( a(       Inner/around pairs: () [] {} <>
  p P         Put after/before cursor      rX  Replace character
  u Ctrl-r    Undo/redo                    .  Repeat last edit
  J           Join lines                   ~  Toggle case
  >> <<       Indent/unindent lines (also >/< in Visual mode)
  "ay "ap     Named registers (also works with d/c); "_d discards
  qa … q      Record macro a               @a @@  Play/repeat macro

SEARCH & COMMANDS
  /text ?text Search forward/back (regular expressions); n N repeat
  * #         Search word under cursor     :12  Go to line 12
  :s/old/new/g       Replace on current line; add i for ignore case
  :%s/old/new/g      Replace in whole file; :2,5s/old/new/g for range
  :w [path]         Save in the virtual filesystem
  :q :q! :wq :x     Quit, discard, save+quit, save-if-changed+quit
  :e path           Edit another file; :e! reload/discard current
  :ls :buffers      List open buffers
  :b 2 :bn :bp      Switch buffer (unsaved buffers remain in memory)
  :bd :bd!          Close buffer, optionally discard edits
  :wa :qa :qa! :wqa Save/quit all buffers
  :set number       Line numbers (:set nonumber to hide)
  :set ignorecase   Ignore case in search (:set noignorecase)
  :set tabstop=4    Tab width; :set shiftwidth=4 for indentation
  :help             This guide; Esc returns to your file

Touch controls provide Insert, Esc, command entry, save and quit.
Tab inserts indentation in Insert mode; Shift+Tab leaves the editor.
Edits last until Terminal closes. No host files are changed.
This custom editor does not implement Vimscript, plugins, shell
commands, split windows, visual-block mode or every Vim command.`;

export class VimSession {
  constructor(adapter, path = '') {
    this.adapter = adapter;
    this.buffers = [];
    this.index = 0;
    this.mode = 'normal';
    this.anchor = 0;
    this.message = '';
    this.command = '';
    this.help = false;
    this.number = true;
    this.ignorecase = false;
    this.tabstop = 4;
    this.shiftwidth = 2;
    this.registers = new Map();
    this.macros = new Map();
    this.marks = new Map();
    this.search = null;
    this.find = null;
    this.lastChange = [];
    this.sequence = [];
    this.replaying = 0;
    this.closed = false;
    this.reset();
    this.edit(path);
  }
  get buffer() { return this.buffers[this.index]; }
  get text() { return this.buffer.text; }
  get cursor() { return this.buffer.cursor; }
  set cursor(value) { this.buffer.cursor = clamp(value, 0, this.text.length); }
  get dirty() { return this.buffer.text !== this.buffer.saved || !this.buffer.exists; }
  reset() { this.count = ''; this.operator = ''; this.operatorCount = 1; this.pending = ''; this.register = '"'; }
  lineStart(pos = this.cursor) { return pos <= 0 ? 0 : this.text.lastIndexOf('\n', pos - 1) + 1; }
  lineEnd(pos = this.cursor) { const n = this.text.indexOf('\n', pos); return n < 0 ? this.text.length : n; }
  lineNumber(pos = this.cursor) { return this.text.slice(0, pos).split('\n').length; }
  linePosition(row) {
    const lines = this.text.split('\n');
    return lines.slice(0, clamp(row - 1, 0, lines.length - 1)).reduce((n, line) => n + line.length + 1, 0);
  }
  normalCursor() { this.cursor = Math.min(this.cursor, Math.max(this.lineStart(), this.lineEnd() - 1)); }
  snapshot() { return { text: this.text, cursor: this.cursor }; }
  begin() { if (!this.transaction) this.transaction = this.snapshot(); }
  commit() {
    if (this.transaction && this.transaction.text !== this.text) {
      this.buffer.undo.push(this.transaction);
      this.buffer.redo = [];
      if (!this.replaying) this.lastChange = [...this.sequence];
    }
    this.transaction = null;
  }
  splice(start, end, text = '') { this.buffer.text = this.text.slice(0, start) + text + this.text.slice(end); this.cursor = start; }
  undo(redo = false) {
    const source = redo ? this.buffer.redo : this.buffer.undo;
    const target = redo ? this.buffer.undo : this.buffer.redo;
    const snapshot = source.pop();
    if (!snapshot) { this.message = redo ? 'Already at newest change' : 'Already at oldest change'; return; }
    target.push(this.snapshot()); Object.assign(this.buffer, snapshot);
  }
  edit(path, force = false) {
    if (force && this.buffer) {
      const file = this.adapter.read(path || this.buffer.path);
      Object.assign(this.buffer, {path:file.path, text:file.content, saved:file.content, exists:file.exists, cursor:0, undo:[], redo:[]});
      return;
    }
    const file = path ? this.adapter.read(unquote(path)) : {path:'', content:'', exists:false};
    const existing = file.path && this.buffers.findIndex(b => b.path === file.path);
    if (typeof existing === 'number' && existing >= 0) { this.index = existing; return; }
    this.buffers.push({path:file.path, text:file.content, saved:file.content, exists:file.exists, cursor:0, undo:[], redo:[]});
    this.index = this.buffers.length - 1;
    this.message = file.exists ? file.path : '[New file]';
  }
  write(path = '') {
    const target = unquote(path) || this.buffer.path;
    if (!target) throw Error('No file name. Use :w filename');
    this.buffer.path = this.adapter.write(target, this.text);
    this.buffer.saved = this.text; this.buffer.exists = true;
    this.message = `"${this.buffer.path}" ${this.text.split('\n').length} lines written`;
  }
  quit(force = false) {
    if (!force && this.buffers.some(b => b.text !== b.saved)) throw Error('Unsaved changes. Use :w to save or :q! to discard.');
    this.closed = true;
  }
  input(text, cursor) {
    if (!['insert', 'replace'].includes(this.mode)) return;
    let start = 0;
    while (start < this.text.length && start < text.length && this.text[start] === text[start]) start++;
    let oldEnd = this.text.length, newEnd = text.length;
    while (oldEnd > start && newEnd > start && this.text[oldEnd - 1] === text[newEnd - 1]) { oldEnd--; newEnd--; }
    const action = {edit:true, offset:start - this.cursor, remove:oldEnd - start, value:text.slice(start, newEnd)};
    this.record(action);
    this.begin();
    if (this.mode === 'replace' && action.remove === 0 && !action.value.includes('\n')) {
      oldEnd = Math.min(start + action.value.length, this.lineEnd(start));
      text = this.text.slice(0,start) + action.value + this.text.slice(oldEnd);
      action.remove = oldEnd - start;
    }
    this.buffer.text = text; this.cursor = cursor;
  }
  record(action) {
    if (this.recording && !this.replaying) this.macros.get(this.recording).push(action);
    this.sequence.push(action);
  }
  replay(actions, count = 1) {
    if (this.replaying > 10) { this.message = 'Macro recursion limit reached'; return; }
    this.replaying++;
    for (let n=0; n<Math.min(count,1000) && !this.closed; n++) {
      for (const action of [...actions]) {
        if (action.edit) {
          this.begin();
          const start = clamp(this.cursor + action.offset,0,this.text.length);
          this.splice(start,start + action.remove,action.value);
          this.cursor = start + action.value.length;
        } else if (action.command) this.execute(action.command);
        else this.key(action.key, action.ctrl);
      }
    }
    this.replaying--;
  }
  motion(key, count = 1) {
    let pos = this.cursor;
    const start = this.lineStart(), end = this.lineEnd();
    let inclusive = false, linewise = false;
    if (key === 'h' || key === 'ArrowLeft') pos = Math.max(start,pos-count);
    else if (key === 'l' || key === 'ArrowRight') pos = Math.min(Math.max(start,end-1),pos+count);
    else if (['j','k','ArrowDown','ArrowUp'].includes(key)) {
      const targetRow = this.lineNumber() + (['j','ArrowDown'].includes(key) ? count : -count);
      const nextStart = this.linePosition(targetRow);
      pos = Math.min(nextStart+pos-start,Math.max(nextStart,this.lineEnd(nextStart)-1)); linewise = true;
    } else if (key === '0' || key === 'Home') pos = start;
    else if (key === '^') pos = start + (this.text.slice(start,end).search(/\S/) + 1 || 1) - 1;
    else if (key === '$' || key === 'End') { pos = Math.max(start,end-1); inclusive=true; }
    else if (key === 'gg') { pos = this.linePosition(count); linewise=true; }
    else if (key === 'G') { pos = this.linePosition(this.count ? count : this.text.split('\n').length); linewise=true; }
    else if ('wWbBeE'.includes(key)) {
      const big = key === key.toUpperCase();
      for (let n=0;n<count;n++) {
        if (key.toLowerCase() === 'w') {
          const kind = wordKind(this.text[pos],big);
          while(pos<this.text.length && wordKind(this.text[pos],big)===kind) pos++;
          while(pos<this.text.length && wordKind(this.text[pos],big)===0) pos++;
        } else if (key.toLowerCase() === 'b') {
          pos = Math.max(0,pos-1);
          while(pos>0 && wordKind(this.text[pos],big)===0) pos--;
          const kind = wordKind(this.text[pos],big);
          while(pos>0 && wordKind(this.text[pos-1],big)===kind) pos--;
        } else {
          pos = Math.min(this.text.length-1,pos+1);
          while(pos<this.text.length-1 && wordKind(this.text[pos],big)===0) pos++;
          const kind = wordKind(this.text[pos],big);
          while(pos<this.text.length-1 && wordKind(this.text[pos+1],big)===kind) pos++;
          inclusive = true;
        }
      }
    } else if (key === '%') {
      const pairs='()[]{}';
      let at=pos;
      while(at<end && !pairs.includes(this.text[at])) at++;
      if(at===end) return null;
      const index=pairs.indexOf(this.text[at]), direction=index%2===0?1:-1;
      const open=this.text[at], close=pairs[index+direction];
      let depth=1; pos=at;
      while((pos+=direction)>=0 && pos<this.text.length) {
        if(this.text[pos]===open) depth++;
        if(this.text[pos]===close && --depth===0) break;
      }
      if(pos<0 || pos>=this.text.length) return null;
      inclusive=true;
    } else return null;
    return {pos:clamp(pos,0,this.text.length),inclusive,linewise};
  }
  range(motion) {
    let start = Math.min(this.cursor,motion.pos), end = Math.max(this.cursor,motion.pos);
    if (motion.linewise) { start=this.lineStart(start); end=Math.min(this.text.length,this.lineEnd(end)+1); }
    else if (motion.inclusive) end=Math.min(this.text.length,end+1);
    return {start,end,linewise:motion.linewise};
  }
  selection() { return this.range({pos:this.anchor,inclusive:true,linewise:this.mode==='visual-line'}); }
  textObject(key, around) {
    let start=this.cursor, end=this.cursor;
    if (key==='w' || key==='W') {
      const kind=wordKind(this.text[start],key==='W');
      while(start>0 && wordKind(this.text[start-1],key==='W')===kind) start--;
      while(end<this.text.length && wordKind(this.text[end],key==='W')===kind) end++;
      if(around) { const prior=end; while(end<this.text.length && /\s/.test(this.text[end]))end++; if(end===prior)while(start>0 && /\s/.test(this.text[start-1]))start--; }
    } else if ('"\'`'.includes(key)) {
      const line=this.lineStart(); start=this.text.lastIndexOf(key,this.cursor);
      if(start<line) start=this.text.indexOf(key,this.cursor);
      end=this.text.indexOf(key,start+1);
      if(start<0 || end<0 || end>this.lineEnd()) return null;
      if(around)end++; else start++;
    } else {
      const pairs={'(':')',')':')','[':']',']':']','{':'}','}':'}','<':'>','>':'>'};
      const right=pairs[key]; if(!right)return null;
      const left={')':'(',']':'[','}':'{','>':'<'}[right];
      let depth=0;
      for(start=this.cursor;start>=0;start--) {
        if(this.text[start]===right && start!==this.cursor)depth++;
        if(this.text[start]===left) { if(depth===0)break; depth--; }
      }
      if(start<0)return null;
      depth=1;
      for(end=start+1;end<this.text.length;end++) {
        if(this.text[end]===left)depth++;
        if(this.text[end]===right && --depth===0)break;
      }
      if(end===this.text.length)return null;
      if(around)end++; else start++;
    }
    return {start,end,linewise:false};
  }
  operate(operator, range) {
    if(!range)return;
    let {start,end,linewise}=range;
    const value=this.text.slice(start,end);
    if(['d','c','y'].includes(operator) && this.register!=='_') {
      const entry={text:value,linewise}; this.registers.set('"',entry);
      this.registers.set(operator==='y'?'0':'1',entry);
      if(this.register!=='"')this.registers.set(this.register,entry);
    }
    if(operator==='y') { this.cursor=start; this.message=`${value.split('\n').length} lines yanked`; }
    else {
      this.begin();
      if(operator==='>' || operator==='<') {
        const lines=value.split('\n');
        this.splice(start,end,lines.map((line,i)=>i===lines.length-1 && !line ? line : operator==='>' ? ' '.repeat(this.shiftwidth)+line : line.replace(new RegExp(`^( {1,${this.shiftwidth}}|\\t)`),'')).join('\n'));
      } else if(operator==='~' || operator==='u' || operator==='U') {
        this.splice(start,end,operator==='u'?value.toLowerCase():operator==='U'?value.toUpperCase():[...value].map(c=>c===c.toUpperCase()?c.toLowerCase():c.toUpperCase()).join(''));
      } else {
        if(linewise && end===this.text.length && start>0 && operator==='d')start--;
        this.splice(start,end,operator==='c' && linewise && end<this.text.length?'\n':'');
        if(operator==='c')this.mode='insert';
      }
      if(this.mode!=='insert')this.commit();
    }
    if(this.mode!=='insert') { this.mode='normal'; this.normalCursor(); }
    this.reset();
  }
  findCharacter(key, char, count=1) {
    const forward=key===key.toLowerCase(); let pos=this.cursor;
    for(let n=0;n<count;n++) {
      pos=forward?this.text.indexOf(char,pos+1):this.text.lastIndexOf(char,pos-1);
      if(pos<this.lineStart() || pos>=this.lineEnd()) { this.message=`Character not found: ${char}`; return null; }
    }
    if(key.toLowerCase()==='t')pos+=forward?-1:1;
    return {pos,inclusive:forward,linewise:false};
  }
  searchFor(pattern, direction=1, count=1) {
    if(!pattern)pattern=this.search?.pattern;
    if(!pattern)return;
    const regex=new RegExp(pattern,'g'+(this.ignorecase?'i':''));
    const matches=[...this.text.matchAll(regex)].map(m=>m.index);
    if(!matches.length)throw Error(`Pattern not found: ${pattern}`);
    this.search={pattern,direction};
    for(let n=0;n<count;n++)this.cursor=direction>0 ? matches.find(p=>p>this.cursor)??matches[0] : matches.findLast(p=>p<this.cursor)??matches.at(-1);
    this.normalCursor();
  }
  key(key, ctrl=false) {
    this.message='';
    if(this.help) { if(key==='Escape')this.help=false; return true; }
    if(key==='Tab' && this.mode!=='insert' && this.mode!=='replace')return false;
    if(this.recording && key==='q' && this.mode==='normal' && !this.pending && !this.operator) { this.recording=null; this.message='Macro recorded'; return true; }
    if(this.mode==='normal' && !this.pending && !this.operator && !this.count && this.register==='"')this.sequence=[];
    this.record({key,ctrl});
    if(key==='Escape' || (ctrl && (key==='[' || key==='c'))) {
      if(['insert','replace'].includes(this.mode)) { this.cursor=Math.max(this.lineStart(),this.cursor-1); this.commit(); }
      this.mode='normal'; this.reset(); this.normalCursor(); return true;
    }
    if(['insert','replace'].includes(this.mode))return false;
    if(this.mode==='command' || this.mode==='search')return false;
    const count=Math.min(Number(this.count)||1,10000);
    if(ctrl) {
      if(key==='r')for(let n=0;n<count;n++)this.undo(true);
      else if(key==='d' || key==='u')this.cursor=this.motion(key==='d'?'j':'k',10*count).pos;
      else if(key==='f' || key==='b')this.cursor=this.motion(key==='f'?'j':'k',20*count).pos;
      else return false;
      this.reset();return true;
    }
    if(this.pending) {
      const pending=this.pending;this.pending='';
      if(pending==='register') { this.register=key;return true; }
      if(pending==='macro') { if(/^[a-z]$/.test(key)) { this.recording=key;this.macros.set(key,[]); } this.reset();return true; }
      if(pending==='play') { const name=key==='@'?this.lastMacro:key;this.lastMacro=name; this.reset();this.replay(this.macros.get(name)??[],count);return true; }
      if(pending==='mark') { this.marks.set(key,{path:this.buffer.path,pos:this.cursor});this.reset();return true; }
      if(pending==='jump') { const mark=this.marks.get(key);if(mark?.path===this.buffer.path)this.cursor=mark.pos;this.reset();return true; }
      if(pending==='replace') { this.begin();this.splice(this.cursor,Math.min(this.lineEnd(),this.cursor+count),key.repeat(Math.min(count,this.lineEnd()-this.cursor)));this.commit();this.reset();return true; }
      let motion=null;
      if(pending==='g' && key==='g')motion=this.motion('gg',count*this.operatorCount);
      else if(['f','F','t','T'].includes(pending)) { this.find={key:pending,char:key};motion=this.findCharacter(pending,key,count*this.operatorCount); }
      else if(pending==='inner' || pending==='around') {
        const range=this.textObject(key,pending==='around');
        if(this.operator)this.operate(this.operator,range);
        else if(range) { this.mode='visual';this.anchor=range.start;this.cursor=Math.max(range.start,range.end-1); }
        this.reset();return true;
      }
      if(motion) { if(this.operator)this.operate(this.operator,this.range(motion));else this.cursor=motion.pos; }
      this.reset();return true;
    }
    if(/^[0-9]$/.test(key) && (key!=='0' || this.count)) {this.count+=key;return true;}
    if(key==='g') {this.pending='g';return true;}
    if(['f','F','t','T'].includes(key)) {this.pending=key;return true;}
    if(key==='"') {this.pending='register';return true;}
    if(key==='m' || key==="'" || key==='`') {this.pending=key==='m'?'mark':'jump';return true;}
    if((this.operator || this.mode.startsWith('visual')) && (key==='i' || key==='a')) {this.pending=key==='i'?'inner':'around';return true;}
    if(this.operator) {
      if(key===this.operator) {
        const last=this.linePosition(this.lineNumber()+count*this.operatorCount-1);
        this.operate(this.operator,{start:this.lineStart(),end:Math.min(this.text.length,this.lineEnd(last)+1),linewise:true});return true;
      }
      const motion=this.motion(this.operator==='c' && key==='w'?'e':key,count*this.operatorCount);
      if(motion)this.operate(this.operator,this.range(motion));else this.reset();
      return true;
    }
    if(key===':' || key==='/' || key==='?') {this.mode=key===':'?'command':'search';this.command=key;this.reset();return true;}
    if(key==='v' || key==='V') {this.mode=this.mode.startsWith('visual')?'normal':key==='v'?'visual':'visual-line';this.anchor=this.cursor;this.reset();return true;}
    if(this.mode.startsWith('visual') && ['d','c','y','>','<','~','u','U','x'].includes(key)) {this.operate(key==='x'?'d':key,this.selection());return true;}
    const motion=this.motion(key,count);
    if(motion) {this.cursor=motion.pos;this.count='';return true;}
    if(['d','c','y','>','<'].includes(key)) {this.operator=key;this.operatorCount=count;this.count='';return true;}
    if(key==='u')for(let n=0;n<count;n++)this.undo();
    else if(key==='q') {this.pending='macro';return true;}
    else if(key==='@') {this.pending='play';return true;}
    else if(key==='.') {const change=[...this.lastChange];this.reset();this.replay(change,count);return true;}
    else if(key==='r') {this.pending='replace';return true;}
    else if(['i','a','I','A','o','O','R'].includes(key)) {
      this.begin();
      if(key==='a')this.cursor=Math.min(this.cursor+1,this.lineEnd());
      if(key==='A')this.cursor=this.lineEnd();
      if(key==='I')this.cursor=this.motion('^').pos;
      if(key==='o') {const end=this.lineEnd();this.splice(end,end,'\n');this.cursor=end+1;}
      if(key==='O') {const start=this.lineStart();this.splice(start,start,'\n');}
      this.mode=key==='R'?'replace':'insert';
    } else if(key==='x' || key==='X' || key==='s') {
      this.operate(key==='s'?'c':'d',{start:key==='X'?Math.max(this.lineStart(),this.cursor-count):this.cursor,end:key==='X'?this.cursor:Math.min(this.lineEnd(),this.cursor+count),linewise:false});
    } else if(key==='D' || key==='C')this.operate(key==='D'?'d':'c',{start:this.cursor,end:this.lineEnd(),linewise:false});
    else if(key==='p' || key==='P') {
      const entry=this.registers.get(this.register);if(!entry){this.reset();return true;}
      this.begin();let pos=this.cursor, value=entry.text.repeat(count);
      if(entry.linewise) {
        if(!value.endsWith('\n'))value+='\n';
        pos=key==='P'?this.lineStart():Math.min(this.text.length,this.lineEnd()+1);
        if(key==='p' && this.lineEnd()===this.text.length){pos=this.text.length;value='\n'+value.replace(/\n$/,'');}
      } else if(key==='p')pos=Math.min(pos+1,this.lineEnd());
      this.splice(pos,pos,value);if(!entry.linewise)this.cursor=pos+value.length-1;
      this.commit();this.normalCursor();
    } else if(key==='J') {
      this.begin();for(let n=0;n<Math.max(1,count-1);n++){const end=this.lineEnd();if(end===this.text.length)break;const next=this.text.slice(end+1).match(/^\s*/)[0].length;this.splice(end,end+1+next,' ');}
      this.commit();
    } else if(key==='~') {const pos=this.cursor;this.operate('~',{start:pos,end:Math.min(this.lineEnd(),pos+count),linewise:false});this.cursor=Math.min(this.lineEnd()-1,pos+count);}
    else if(key==='n' || key==='N') {const search=this.search;if(search)this.searchFor(search.pattern,search.direction*(key==='n'?1:-1),count);if(search)this.search=search;}
    else if(key==='*' || key==='#') {const range=this.textObject('w',false);if(range)this.searchFor(this.text.slice(range.start,range.end).replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),key==='*'?1:-1,count);}
    else if(key===';' || key===',') {if(this.find){const f=this.find;const motion=this.findCharacter(key===';'?f.key:f.key===f.key.toLowerCase()?f.key.toUpperCase():f.key.toLowerCase(),f.char,count);if(motion)this.cursor=motion.pos;}}
    this.reset();return true;
  }
  execute(command) {
    this.record({command});
    this.mode='normal';this.command='';this.message='';
    try {
      if(command[0]==='/' || command[0]==='?') {this.searchFor(command.slice(1),command[0]==='/'?1:-1);return;}
      const raw=command.replace(/^:/,'').trim();
      if(!raw)return;
      if(/^\d+$/.test(raw)) {this.cursor=this.linePosition(Number(raw));return;}
      const substitute=raw.match(/^(%|\d+(?:,\d+)?)?s([^\w\s])/);
      if(substitute) {
        const [,range,separator]=substitute;
        const rest=raw.slice(substitute[0].length);let part='',parts=[];
        for(let i=0;i<rest.length;i++){if(rest[i]==='\\' && rest[i+1]===separator){part+=separator;i++;}else if(rest[i]===separator){parts.push(part);part='';}else part+=rest[i];}parts.push(part);
        if(parts.length<2)throw Error('Usage: :[range]s/old/new/[gi]');
        const [pattern,replacement,flags='']=parts;
        if(/[^gi]/.test(flags))throw Error('Supported substitute flags: g, i');
        const regex=new RegExp(pattern || this.search?.pattern || '',flags);
        const lines=this.text.split('\n'), bounds=range==='%'?[1,lines.length]:range?range.split(',').map(Number):[this.lineNumber()];
        const low=bounds[0],high=bounds[1]??low;
        if(low<1 || high<low || high>lines.length)throw Error('Invalid line range');
        let changed=false;
        const replacementText = replacement.replace(/\\&|&|\\([1-9])/g, (match, group) => match === '\\&' ? '&' : group ? `$${group}` : '$&');
        for(let i=low-1;i<high;i++){const next=lines[i].replace(regex,replacementText);if(next!==lines[i])changed=true;lines[i]=next;}
        if(!changed){this.message='Pattern not found or replacement unchanged';return;}
        this.begin();this.buffer.text=lines.join('\n');this.cursor=this.linePosition(low);this.commit();return;
      }
      const [name,...args]=raw.split(/\s+/), arg=args.join(' '), force=name.endsWith('!'), base=name.replace(/!$/,'');
      if(['w','write','wq','x'].includes(base)) {if(base!=='x' || this.dirty)this.write(arg);if(base==='wq' || base==='x')this.quit(force);}
      else if(['q','quit','qa','qall'].includes(base))this.quit(force);
      else if(base==='wa' || base==='wall' || base==='wqa') {const index=this.index;try{for(let i=0;i<this.buffers.length;i++){this.index=i;if(this.dirty)this.write();}}finally{this.index=index;}if(base==='wqa')this.quit();}
      else if(base==='e' || base==='edit') {if(force)this.edit(arg,true);else if(arg)this.edit(arg);else this.message=this.buffer.path || '[No Name]';}
      else if(base==='ls' || base==='buffers')this.message=this.buffers.map((b,i)=>`${i+1}${i===this.index?' %':''}${b.text!==b.saved?' +':''} ${b.path || '[No Name]'}`).join('\n');
      else if(['bn','bnext','bp','bprevious','b','buffer'].includes(base)) {
        const index=base==='bn'||base==='bnext'?(this.index+1)%this.buffers.length:base==='bp'||base==='bprevious'?(this.index+this.buffers.length-1)%this.buffers.length:/^\d+$/.test(arg)?Number(arg)-1:this.buffers.findIndex(b=>b.path.endsWith(unquote(arg)));
        if(index<0 || index>=this.buffers.length)throw Error('Buffer not found');this.index=index;
      } else if(base==='bd' || base==='bdelete') {if(this.dirty && !force)throw Error('Unsaved changes. Use :bd! to discard.');if(this.buffers.length===1)this.quit(force);else{this.buffers.splice(this.index,1);this.index=Math.min(this.index,this.buffers.length-1);}}
      else if(base==='set') {
        for(const option of args){if(option==='number'||option==='nu')this.number=true;else if(option==='nonumber'||option==='nonu')this.number=false;else if(option==='ignorecase'||option==='ic')this.ignorecase=true;else if(option==='noignorecase'||option==='noic')this.ignorecase=false;else {const match=option.match(/^(tabstop|ts|shiftwidth|sw)=(\d+)$/);if(!match || +match[2]<1 || +match[2]>16)throw Error(`Unsupported option: ${option}`);this[['ts','tabstop'].includes(match[1])?'tabstop':'shiftwidth']=+match[2];}}
      } else if(base==='help' || base==='h')this.help=true;
      else throw Error(`Not an editor command: ${raw}`);
    } catch(error) {this.message=error.message;}
    this.normalCursor();this.reset();
  }
}
