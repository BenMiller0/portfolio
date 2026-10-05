import React, { useState, useEffect, useRef } from 'react';

const USER = 'ben';
const HOST = 'portfolio';

const toProjectFileName = (title) => `${title
  .replace(/[^a-zA-Z0-9]+/g, '_')
  .replace(/^_+|_+$/g, '')}.proj`;

const createProjectFile = ({ title, description, technologies, github, photos = [], miscLink }) => ({
  type: 'file',
  content: [
    title,
    '─'.repeat(Math.min(title.length, 48)),
    '',
    description,
    '',
    `Technologies: ${technologies}`,
    github ? `GitHub: ${github}` : null,
    miscLink ? `${miscLink.displayName}: ${miscLink.url.trim()}` : null,
    photos.length ? `Photos: ${photos.join(', ')}` : null
  ].filter(line => line !== null).join('\n')
});

const createFileSystem = (projects) => ({
  '~': {
    type: 'dir',
    children: {
      'About.txt': {
        type: 'file',
        content: 'Benjamin Miller\nUC San Diego - Computer Science\nEmbedded Systems & Software Engineer'
      },
      'About_Site.txt': {
        type: 'file',
        content: 'This portfolio is designed to look and feel like a desktop environment, showcasing projects in embedded systems, AI/ML, and app/web app development.'
      },
      'Experience.txt': {
        type: 'file',
        content: [
          'Electronic Props Designer, Star Wars Club at UCSD',
          'Software Engineering Lead & VP, Themed Entertainment Association at UCSD',
          'Software Engineering Intern, Western Digital',
          'Software Developer Intern, Center for Applied Internet Data Analysis',
          'Resident Advisor, COSMOS UC San Diego'
        ].join('\n')
      },
      'GitHub.url': { type: 'file', content: 'https://github.com/BenMiller0' },
      'LinkedIn.url': { type: 'file', content: 'https://linkedin.com/in/benjamin-miller-ucsd' },
      'Hardware_Resume.pdf': { type: 'file', content: '/resumes/Resume_Benjamin_Miller.pdf' },
      'Software_Resume.pdf': { type: 'file', content: '/resumes/Resume-Benjamin-Miller.pdf' },
      ...projects.reduce((files, project) => ({
        ...files,
        [toProjectFileName(project.title)]: createProjectFile(project)
      }), {})
    }
  }
});

const parseCommand = (commandText) => {
  const matches = commandText.matchAll(/"([^"]*)"|'([^']*)'|(\S+)/g);
  return Array.from(matches, match => match[1] ?? match[2] ?? match[3]);
};

const getPathArg = (args) => {
  const joined = args.join(' ');
  return joined === '/' ? '/' : joined.replace(/\/+$/, '');
};

const globToRegExp = (pattern) => {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');

  return new RegExp(`^${escaped}$`, 'i');
};

const parseLinePreviewArgs = (args) => {
  let lineCount = 10;
  let fileArgIndex = 0;

  if (args[0] === '-n') {
    lineCount = Number(args[1]);
    fileArgIndex = 2;
  } else if (/^-n\d+$/.test(args[0] || '')) {
    lineCount = Number(args[0].slice(2));
    fileArgIndex = 1;
  } else if (/^-\d+$/.test(args[0] || '')) {
    lineCount = Number(args[0].slice(1));
    fileArgIndex = 1;
  }

  if (!Number.isSafeInteger(lineCount) || lineCount < 0) {
    return { error: 'invalid number of lines' };
  }

  return {
    lineCount,
    fileName: getPathArg(args.slice(fileArgIndex))
  };
};

const isOpenablePath = (path) => {
  if (path.startsWith('/')) return true;

  try {
    const url = new URL(path);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const findEntryMatch = (directory, name) => {
  if (directory[name]) return { key: name, node: directory[name] };

  const lowerName = name.toLowerCase();
  const matchingKey = Object.keys(directory).find(key => {
    const lowerKey = key.toLowerCase();
    const baseName = lowerKey.includes('.') ? lowerKey.slice(0, lowerKey.lastIndexOf('.')) : lowerKey;
    return lowerKey === lowerName || baseName === lowerName;
  });

  return matchingKey ? { key: matchingKey, node: directory[matchingKey] } : null;
};

const findEntry = (directory, name) => findEntryMatch(directory, name)?.node || null;

const TerminalContent = ({ projects = [] }) => {
  const [input, setInput] = useState('');
  const [currentPath, setCurrentPath] = useState('~');
  const [output, setOutput] = useState([
    { type: 'system', text: 'Type "help" for a list of commands.' }
  ]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);
  const outputRef = useRef(null);
  const fileSystemRef = useRef(createFileSystem(projects));

  useEffect(() => {
    fileSystemRef.current = createFileSystem(projects);
  }, [projects]);

  const resolvePath = (target = currentPath) => {
    if (!target || target === '~' || target === '/') return '~';

    const rawPath = target.startsWith('~')
      ? target
      : target.startsWith('/')
        ? `~${target}`
        : `${currentPath}/${target}`;

    const parts = rawPath.split('/').filter(Boolean);
    const resolved = [];

    for (const part of parts) {
      if (part === '.') continue;
      if (part === '..') {
        if (resolved.length > 1) resolved.pop();
        continue;
      }
      resolved.push(part);
    }

    return resolved.length <= 1 ? '~' : resolved.join('/');
  };

  const getNode = (path) => {
    const match = getPathMatch(path);
    return match?.node || null;
  };

  const getPathMatch = (path) => {
    const pathParts = resolvePath(path).split('/').filter(Boolean);
    let current = fileSystemRef.current;
    const canonicalParts = [];

    for (const [index, part] of pathParts.entries()) {
      const match = findEntryMatch(current, part);
      if (!match) return null;

      canonicalParts.push(match.key);
      const isLastPart = index === pathParts.length - 1;

      if (match.node.type === 'dir') {
        if (isLastPart) {
          return {
            node: match.node.children,
            entry: match.node,
            path: canonicalParts.join('/')
          };
        }
        current = match.node.children;
      } else {
        if (!isLastPart) return null;
        return {
          node: match.node,
          entry: match.node,
          path: canonicalParts.join('/')
        };
      }
    }

    return {
      node: current,
      entry: { type: 'dir' },
      path: '~'
    };
  };

  const getCurrentDirectory = () => getNode(currentPath) || {};

  const getFileEntry = (fileName) => {
    if (!fileName) return null;
    if (fileName.includes('/')) return getPathMatch(fileName)?.entry || null;
    return findEntry(getCurrentDirectory(), fileName);
  };

  const getPromptText = () => `${USER}@${HOST}:${currentPath}$`;

  const renderPrompt = (path = currentPath) => (
    <>
      <span className="terminal-user-host">{USER}@{HOST}</span>
      <span className="terminal-separator">:</span>
      <span className="terminal-path">{path}</span>
      <span className="terminal-symbol">$</span>
    </>
  );

  const getFileColor = (name, node) => {
    if (node.type === 'dir') return 'terminal-dir';
    if (name.endsWith('.url')) return 'terminal-link';
    if (name.endsWith('.md')) return 'terminal-markdown';
    if (name.endsWith('.txt')) return 'terminal-text';
    if (name.endsWith('.pdf')) return 'terminal-pdf';
    if (name.endsWith('.proj')) return 'terminal-project';
    return 'terminal-file';
  };

  const expandWildcards = (pattern, currentDir) => {
    if (!pattern.includes('*') && !pattern.includes('?')) return [pattern];

    const regex = globToRegExp(pattern);
    return Object.keys(currentDir).filter(name => regex.test(name.toLowerCase()));
  };

  const commands = {
    help: () => ({
      type: 'output',
      text: 'Commands\n  ls [-al] [path]    List files and folders\n  cd <directory>     Change directory\n  pwd                Show the current path\n  cat <file>         Read a file\n  open <file>        Open a link or PDF\n  projects           List every .proj file\n  about              Read About.txt\n  resume             List available resumes\n  whoami             A short introduction\n  echo <text>        Print text\n  clear              Clear the terminal\n  date               Show the date and time\n  grep <term> <file> Search a file\n  head/tail [-n N]   Preview a file\n  wc <file>          Count file contents\n  man <command>      Explain a command\n\nTab completes paths. ↑ and ↓ recall commands.'
    }),
    ls: (args) => {
      const optionArgs = args.filter(arg => arg.startsWith('-') && arg !== '-');
      const invalidOption = optionArgs.find(option => !/^-([al]+)$/.test(option));
      if (invalidOption) {
        return { type: 'error', text: `ls: invalid option -- '${invalidOption.slice(1)}'` };
      }

      const flags = optionArgs.join('').replace(/-/g, '');
      const showHidden = flags.includes('a');
      const longFormat = flags.includes('l');
      const targetPath = getPathArg(args.filter(arg => !optionArgs.includes(arg)));
      const targetMatch = targetPath ? getPathMatch(targetPath) : getPathMatch(currentPath);

      if (!targetMatch) {
        return { type: 'error', text: `ls: ${targetPath}: No such file or directory` };
      }

      if (targetMatch.entry.type === 'file') {
        const name = targetMatch.path.split('/').pop();
        const byteCount = new TextEncoder().encode(targetMatch.entry.content || '').length;
        return {
          type: 'output',
          text: '',
          entries: [{
            text: longFormat ? `-rw-r--r--  ${String(byteCount).padStart(6)}  ${name}` : name,
            className: getFileColor(name, targetMatch.entry)
          }]
        };
      }

      const directory = targetMatch.node;
      const items = Object.keys(directory).filter(name => showHidden || !name.startsWith('.'));

      const entries = items.map(name => {
        const item = directory[name];
        const displayName = item.type === 'dir' ? `${name}/` : name;
        const size = item.type === 'dir'
          ? Object.keys(item.children).length
          : new TextEncoder().encode(item.content || '').length;
        const mode = item.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--';
        return {
          text: longFormat ? `${mode}  ${String(size).padStart(6)}  ${displayName}` : displayName,
          className: getFileColor(name, item)
        };
      });

      return {
        type: 'output',
        text: entries.length > 0 ? '' : '(empty directory)',
        entries
      };
    },
    pwd: () => ({
      type: 'output',
      text: currentPath
    }),
    projects: () => ({
      type: 'output',
      text: projects.length ? '' : 'No projects are available right now.',
      entries: projects.map((project, index) => ({
        text: `${String(index + 1).padStart(2, '0')}  ${toProjectFileName(project.title)}`,
        className: 'terminal-project'
      }))
    }),
    about: () => ({
      type: 'output',
      text: fileSystemRef.current['~'].children['About.txt'].content
    }),
    resume: () => ({
      type: 'output',
      text: '',
      entries: [
        { text: 'Hardware_Resume.pdf', className: 'terminal-pdf' },
        { text: 'Software_Resume.pdf', className: 'terminal-pdf' }
      ]
    }),
    whoami: () => ({
      type: 'output',
      text: 'Benjamin Miller — embedded systems, robotics, and product engineering.'
    }),
    cd: (args) => {
      const target = getPathArg(args) || '~';
      const targetMatch = getPathMatch(target);

      if (targetMatch && targetMatch.entry.type === 'dir') {
        setCurrentPath(targetMatch.path);
        return { type: 'output', text: '' };
      }

      return targetMatch
        ? { type: 'error', text: `cd: ${target}: Not a directory` }
        : { type: 'error', text: `cd: ${target}: No such file or directory` };
    },
    cat: (args) => {
      const fileName = getPathArg(args);
      if (!fileName) {
        return { type: 'error', text: 'cat: missing file operand' };
      }
      const currentDir = getCurrentDirectory();
      const expanded = expandWildcards(fileName, currentDir);
      
      if (expanded.length === 1 && expanded[0] === fileName) {
        const resolvedFile = getFileEntry(fileName);
        if (resolvedFile && resolvedFile.type === 'file') {
          return { type: 'output', text: resolvedFile.content };
        }
        return resolvedFile?.type === 'dir'
          ? { type: 'error', text: `cat: ${fileName}: Is a directory` }
          : { type: 'error', text: `cat: ${fileName}: No such file or directory` };
      }
      
      const contents = [];
      for (const name of expanded) {
        const file = currentDir[name];
        if (file && file.type === 'file') {
          contents.push(`=== ${name} ===`);
          contents.push(file.content);
        }
      }
      
      if (contents.length === 0) {
        return { type: 'error', text: `cat: no matching files` };
      }
      return { type: 'output', text: contents.join('\n') };
    },
    open: (args) => {
      const fileName = getPathArg(args);
      if (!fileName) {
        return { type: 'error', text: 'open: missing file operand' };
      }
      const resolvedFile = getFileEntry(fileName);
      if (!resolvedFile || resolvedFile.type !== 'file') {
        return resolvedFile?.type === 'dir'
          ? { type: 'error', text: `open: ${fileName}: Is a directory` }
          : { type: 'error', text: `open: ${fileName}: No such file or directory` };
      }
      if (isOpenablePath(resolvedFile.content)) {
        window.open(resolvedFile.content, '_blank', 'noopener,noreferrer');
        return { type: 'output', text: `Opened ${resolvedFile.content}` };
      }
      return { type: 'error', text: `open: ${fileName}: Not a URL or app path` };
    },
    echo: (args) => ({
      type: 'output',
      text: args.join(' ')
    }),
    clear: () => ({ type: 'clear', text: '' }),
    date: () => ({ type: 'output', text: new Date().toString() }),
    grep: (args) => {
      if (args.length < 2) {
        return { type: 'error', text: 'grep: missing pattern and file operand' };
      }
      const pattern = args[0];
      const fileName = getPathArg(args.slice(1));
      const currentDir = getCurrentDirectory();
      const expanded = expandWildcards(fileName, currentDir);

      if (expanded.length === 0) {
        return { type: 'error', text: `grep: ${fileName}: No such file or directory` };
      }
      
      if (expanded.length === 1 && expanded[0] === fileName) {
        const file = getFileEntry(fileName);
        if (!file || file.type !== 'file') {
          return file?.type === 'dir'
            ? { type: 'error', text: `grep: ${fileName}: Is a directory` }
            : { type: 'error', text: `grep: ${fileName}: No such file or directory` };
        }
        const lines = file.content.split('\n');
        const matches = lines.filter(line => line.toLowerCase().includes(pattern.toLowerCase()));
        if (matches.length === 0) {
          return { type: 'output', text: '' };
        }
        return {
          type: 'output',
          text: matches.join('\n')
        };
      }
      
      const allMatches = [];
      for (const name of expanded) {
        const file = currentDir[name];
        if (file && file.type === 'file') {
          const lines = file.content.split('\n');
          const matches = lines.filter(line => line.toLowerCase().includes(pattern.toLowerCase()));
          if (matches.length > 0) {
            allMatches.push(`${name}:${matches.join('\n' + name + ':')}`);
          }
        }
      }
      
      if (allMatches.length === 0) {
        return { type: 'output', text: '' };
      }
      return {
        type: 'output',
        text: allMatches.join('\n')
      };
    },
    head: (args) => {
      const { lineCount, fileName, error } = parseLinePreviewArgs(args);
      if (error) return { type: 'error', text: `head: ${error}` };
      if (!fileName) {
        return { type: 'error', text: 'head: missing file operand' };
      }
      const file = getFileEntry(fileName);
      if (!file || file.type !== 'file') {
        return file?.type === 'dir'
          ? { type: 'error', text: `head: ${fileName}: Is a directory` }
          : { type: 'error', text: `head: ${fileName}: No such file or directory` };
      }
      const fileLines = file.content.split('\n');
      const headLines = fileLines.slice(0, lineCount);
      return {
        type: 'output',
        text: headLines.join('\n')
      };
    },
    tail: (args) => {
      const { lineCount, fileName, error } = parseLinePreviewArgs(args);
      if (error) return { type: 'error', text: `tail: ${error}` };
      if (!fileName) {
        return { type: 'error', text: 'tail: missing file operand' };
      }
      const file = getFileEntry(fileName);
      if (!file || file.type !== 'file') {
        return file?.type === 'dir'
          ? { type: 'error', text: `tail: ${fileName}: Is a directory` }
          : { type: 'error', text: `tail: ${fileName}: No such file or directory` };
      }
      const fileLines = file.content.split('\n');
      const tailLines = lineCount === 0 ? [] : fileLines.slice(-lineCount);
      return {
        type: 'output',
        text: tailLines.join('\n')
      };
    },
    wc: (args) => {
      const fileName = getPathArg(args);
      if (!fileName) {
        return { type: 'error', text: 'wc: missing file operand' };
      }
      const file = getFileEntry(fileName);
      if (!file || file.type !== 'file') {
        return file?.type === 'dir'
          ? { type: 'error', text: `wc: ${fileName}: Is a directory` }
          : { type: 'error', text: `wc: ${fileName}: No such file or directory` };
      }
      const content = file.content;
      const lineCount = (content.match(/\n/g) || []).length;
      const wordCount = content.trim().split(/\s+/).filter(w => w).length;
      const byteCount = new TextEncoder().encode(content).length;
      return {
        type: 'output',
        text: `  ${lineCount}  ${wordCount}  ${byteCount} ${fileName}`
      };
    },
    man: (args) => {
      const cmdName = getPathArg(args).toLowerCase();
      if (!cmdName) {
        return { type: 'error', text: 'What manual page do you want?' };
      }
      const manPages = {
        ls: 'LS(1)\n\nNAME\n    ls - list directory contents\n\nSYNOPSIS\n    ls [-la]\n\nDESCRIPTION\n    List information about files and directories.\n    -l  use a long listing format\n    -a  do not ignore entries starting with .',
        cd: 'CD(1)\n\nNAME\n    cd - change directory\n\nSYNOPSIS\n    cd [dir]\n\nDESCRIPTION\n    Change the current directory to DIR.',
        cat: 'CAT(1)\n\nNAME\n    cat - concatenate files and print\n\nSYNOPSIS\n    cat [file]\n\nDESCRIPTION\n    Concatenate FILE(s) to standard output.',
        grep: 'GREP(1)\n\nNAME\n    grep - print lines matching a pattern\n\nSYNOPSIS\n    grep [pattern] [file]\n\nDESCRIPTION\n    Search for PATTERN in FILE.',
        head: 'HEAD(1)\n\nNAME\n    head - output the first part of files\n\nSYNOPSIS\n    head [-n N] [file]\n\nDESCRIPTION\n    Print the first N lines (default 10).',
        tail: 'TAIL(1)\n\nNAME\n    tail - output the last part of files\n\nSYNOPSIS\n    tail [-n N] [file]\n\nDESCRIPTION\n    Print the last N lines (default 10).',
        wc: 'WC(1)\n\nNAME\n    wc - print newline, word, and byte counts\n\nSYNOPSIS\n    wc [file]\n\nDESCRIPTION\n    Print newline, word, and byte counts for FILE.',
        pwd: 'PWD(1)\n\nNAME\n    pwd - print the current working path\n\nSYNOPSIS\n    pwd',
        open: 'OPEN(1)\n\nNAME\n    open - open a portfolio link or PDF\n\nSYNOPSIS\n    open [file]',
        echo: 'ECHO(1)\n\nNAME\n    echo - display a line of text\n\nSYNOPSIS\n    echo [text]',
        clear: 'CLEAR(1)\n\nNAME\n    clear - clear terminal output\n\nSYNOPSIS\n    clear',
        date: 'DATE(1)\n\nNAME\n    date - display the current date and time\n\nSYNOPSIS\n    date',
        man: 'MAN(1)\n\nNAME\n    man - display a command manual\n\nSYNOPSIS\n    man [command]',
        help: 'HELP(1)\n\nNAME\n    help - list available commands\n\nSYNOPSIS\n    help',
        projects: 'PROJECTS(1)\n\nNAME\n    projects - list every .proj file in this portfolio',
        about: 'ABOUT(1)\n\nNAME\n    about - display the contents of About.txt',
        resume: 'RESUME(1)\n\nNAME\n    resume - list the available resume files',
        whoami: 'WHOAMI(1)\n\nNAME\n    whoami - display a short introduction',
      };
      const manPage = manPages[cmdName];
      if (!manPage) {
        return { type: 'error', text: `No manual entry for ${cmdName}` };
      }
      return { type: 'output', text: manPage };
    },
  };

  const getCommonPrefix = (values) => {
    if (values.length === 0) return '';

    return values.reduce((prefix, value) => {
      let index = 0;
      while (index < prefix.length && prefix[index] === value[index]) {
        index++;
      }
      return prefix.slice(0, index);
    });
  };

  const completePath = (pathText, dirsOnly = false) => {
    const lastSlashIndex = pathText.lastIndexOf('/');
    const parentText = lastSlashIndex >= 0 ? pathText.slice(0, lastSlashIndex) : '';
    const partial = lastSlashIndex >= 0 ? pathText.slice(lastSlashIndex + 1) : pathText;
    const parentMatch = parentText ? getPathMatch(parentText) : getPathMatch(currentPath);

    if (!parentMatch || parentMatch.entry.type !== 'dir') return null;

    const matches = Object.entries(parentMatch.node)
      .filter(([, node]) => !dirsOnly || node.type === 'dir')
      .map(([name, node]) => ({ name, node }))
      .filter(({ name }) => name.toLowerCase().startsWith(partial.toLowerCase()));

    if (matches.length === 0) return null;

    const completedName = matches.length === 1
      ? matches[0].name
      : getCommonPrefix(matches.map(({ name }) => name));

    if (!completedName || completedName === partial) return null;

    const matchedNode = matches.find(({ name }) => name === completedName)?.node;
    const suffix = matchedNode?.type === 'dir' ? '/' : ' ';
    const prefix = lastSlashIndex >= 0 ? `${parentText}/` : '';

    return `${prefix}${completedName}${matches.length === 1 ? suffix : ''}`;
  };

  const handleTabCompletion = (e) => {
    e.preventDefault();

    const cursor = e.currentTarget.selectionStart ?? input.length;
    const beforeCursor = input.slice(0, cursor);
    const afterCursor = input.slice(cursor);
    const commandMatch = beforeCursor.match(/^(\S*)(?:\s+(.*))?$/);
    if (!commandMatch) return;

    const [, commandPart, argPart] = commandMatch;
    const commandNames = Object.keys(commands);
    const normalizedCommand = commandPart.toLowerCase();

    if (argPart === undefined) {
      const allMatches = commandNames.filter(command => command.startsWith(normalizedCommand));
      
      if (allMatches.length === 0) return;

      if (allMatches.length === 1) {
        setInput(`${allMatches[0]} ${afterCursor}`);
      } else {
        const completedCommand = getCommonPrefix(allMatches);
        if (completedCommand !== normalizedCommand) {
          setInput(`${completedCommand}${afterCursor}`);
        } else {
          setOutput([...output, { type: 'system', text: allMatches.join('  ') }]);
        }
      }
      return;
    }

    if (!['ls', 'cd', 'cat', 'open', 'grep', 'head', 'tail', 'wc'].includes(normalizedCommand)) return;

    const hasLeadingArguments = ['ls', 'grep', 'head', 'tail'].includes(normalizedCommand);
    const lastSpaceIndex = hasLeadingArguments ? argPart.lastIndexOf(' ') : -1;
    const argumentPrefix = lastSpaceIndex >= 0 ? argPart.slice(0, lastSpaceIndex + 1) : '';
    const pathPart = lastSpaceIndex >= 0 ? argPart.slice(lastSpaceIndex + 1) : argPart;

    const completedPath = completePath(pathPart, normalizedCommand === 'cd');
    if (!completedPath) {
      const parentMatch = pathPart.includes('/')
        ? getPathMatch(pathPart.slice(0, pathPart.lastIndexOf('/')))
        : getPathMatch(currentPath);
      
      if (parentMatch && parentMatch.entry.type === 'dir') {
        const partial = pathPart.includes('/')
          ? pathPart.slice(pathPart.lastIndexOf('/') + 1)
          : pathPart;
        const matches = Object.keys(parentMatch.node)
          .filter(name => name.toLowerCase().startsWith(partial.toLowerCase()));
        
        if (matches.length > 1) {
          const prefix = pathPart.includes('/') ? pathPart.slice(0, pathPart.lastIndexOf('/') + 1) : '';
          setOutput([...output, { type: 'system', text: matches.map(m => argumentPrefix + prefix + m).join('  ') }]);
        }
      }
      return;
    }

    setInput(`${normalizedCommand} ${argumentPrefix}${completedPath}${afterCursor}`);
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const executeCommand = (commandText) => {
    const trimmedInput = commandText.trim();
    if (!trimmedInput) return;

    const parts = parseCommand(trimmedInput);
    const typedCommand = parts[0];
    const commandName = typedCommand.toLowerCase();
    const args = parts.slice(1);

    setCommandHistory((history) => [...history, trimmedInput]);
    setHistoryIndex(-1);
    setInput('');

    const commandFunc = commands[commandName];
    const result = commandFunc
      ? commandFunc(args)
      : { type: 'error', text: `${typedCommand}: command not found. Type "help" for commands.` };

    if (result?.type === 'clear') {
      setOutput([]);
      return;
    }

    setOutput((lines) => {
      const nextOutput = [
        ...lines,
        { type: 'command', path: currentPath, text: trimmedInput }
      ];

      if (result && (result.text || result.entries)) {
        nextOutput.push(result);
      }

      return nextOutput;
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      handleTabCompletion(e);
    } else if (e.key === 'Enter') {
      executeCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  const handleClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="terminal" onClick={handleClick} ref={terminalRef}>
      <div className="terminal-output" ref={outputRef}>
        {output.map((line, index) => (
          <div key={index} className={`terminal-line terminal-${line.type}`}>
            {line.type === 'command' ? (
              <>
                {renderPrompt(line.path)}
                <span className="terminal-command-text"> {line.text}</span>
              </>
            ) : line.entries ? (
              line.entries.map(entry => (
                <React.Fragment key={entry.text}>
                  <span className={entry.className}>{entry.text}</span>
                  {'\n'}
                </React.Fragment>
              ))
            ) : (
              line.text
            )}
          </div>
        ))}
      </div>
      <div className="terminal-input-line">
        <span className="terminal-prompt">{renderPrompt()}</span>
        <input
          ref={inputRef}
          type="text"
          className="terminal-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          aria-label={getPromptText()}
        />
      </div>
    </div>
  );
};

export const terminalWindow = (projects) => ({
  id: 'terminalWindow',
  title: 'Terminal',
  label: 'Terminal',
  color: '#333',
  component: () => <TerminalContent projects={projects} />
});
