import React, { useState, useEffect, useRef } from 'react';

const USER = 'ben';
const HOST = 'portfolio';

const createProjectDirectory = ({ title, description, technologies, github, photos = [], miscLink }) => ({
  type: 'dir',
  children: {
    'README.md': {
      type: 'file',
      content: [
        title,
        '',
        description,
        '',
        `Technologies: ${technologies}`
      ].join('\n')
    },
    'github.url': { type: 'file', content: github },
    ...(miscLink ? { [`${miscLink.displayName}.url`]: { type: 'file', content: miscLink.url.trim() } } : {}),
    photos: {
      type: 'dir',
      children: photos.reduce((files, photo) => ({
        ...files,
        [photo]: { type: 'file', content: `/project_photos/${photo}` }
      }), {})
    }
  }
});

const projects = [
  {
    title: 'Interactive Robotic Figure in C/C++',
    description: 'Achieved real-time audio-to-motion translation for an interactive robotic figure through an embedded C++ audio processing pipeline that synchronizes voice actor speech with robotic mouth movement via I2C communication.',
    technologies: 'C, C++, I2C, Multi-Threading, Servo Motors',
    github: 'https://github.com/BenMiller0/teaAnimatronic',
    photos: ['Taro.png'],
    miscLink: { displayName: 'Demo Video', url: 'https://www.youtube.com/watch?v=8_HPtF_c1NU' }
  },
  {
    title: 'Remote Embedded System Verification',
    description: 'Built a remote firmware verification system enabling flashing, observation, and validation of embedded C/C++ on physical hardware, such as microcontrollers, reducing dependence on simulation-based testing.',
    technologies: 'Python, C/C++, Firmware',
    github: 'https://github.com/BenMiller0/VIS-SSH-ON',
    photos: ['VIS-SSH-ON1.png', 'VIS-SSH-ON2.png'],
    miscLink: { displayName: 'Project Page', url: 'https://benmiller0.github.io/VIS-SSH-ON/' }
  },
  {
    title: 'Darth Vader Suit Firmware',
    description: 'Darth Vader suit firmware built on FreeRTOS. Controls programmable blinking lights on a screen-accurate suit used by Star Wars Club at UC San Diego.',
    technologies: 'C++, FreeRTOS, ESP32, PWM',
    github: 'https://github.com/BenMiller0/darth-vadar-firmware',
    photos: ['vader_suit.jpg', 'vader_embedded.jpg']
  },
  {
    title: 'Computer Vision Spell Casting',
    description: 'Built a distributed edge-AI interactive system combining a custom Android app and embedded hardware to detect gesture-based spells using computer vision and speech recognition.',
    technologies: 'Python, AI/ML, Computer Vision, Arduino UNO Q, Linux, Microcontroller',
    github: 'https://github.com/BenMiller0/computer_vision_spell_casting',
    photos: ['wand_spell_caster.jpg', 'full_wand_system.jpg'],
    miscLink: { displayName: 'Project Page', url: 'https://devpost.com/software/muggle-wand-training' }
  },
  {
    title: 'ML Modeling Theme Park Wait Times',
    description: 'Built and evaluated linear regression and machine learning models to investigate correlation between physical ride characteristics and guest demand.',
    technologies: 'Python, Pandas, NumPy, Scikit-Learn',
    github: 'https://github.com/BenMiller0/Predictive-Modeling-of-Theme-Park-Wait-Times',
    photos: ['ML_theme_park_wait_times_predictions.png']
  },
  {
    title: 'Campus Events Planner Application',
    description: 'Developed a web application for discovering and organizing campus events with a CI/CD pipeline and automated testing.',
    technologies: 'JavaScript, HTML, CSS, Jest, CI/CD',
    github: 'https://github.com/cse110-sp25-group11/card-game',
    photos: ['campus_events_planner.png']
  },
  {
    title: 'TEA @ UCSD Site',
    description: "Developed and maintained the Themed Entertainment Association at UCSD's website, increasing online engagement and visibility.",
    technologies: 'Tailwind CSS, HTML, JavaScript, Github Actions',
    github: 'https://github.com/BenMiller0/teaatucsdsite',
    miscLink: { displayName: 'Website', url: 'https://bit.ly/tea_at_ucsd' }
  },
  {
    title: 'Multithreaded File Compressor in C++',
    description: 'Multithreaded application for high-speed file compression, optimized for performance using parallel processing.',
    technologies: 'C++, Multi-Threading, Makefile',
    github: 'https://github.com/BenMiller0/multiThreadedCompressor'
  }
];

const createFileSystem = () => ({
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
      'Hardware_Resume.pdf': { type: 'file', content: '/resumes/hardware_resume.pdf' },
      'Software_Resume.pdf': { type: 'file', content: '/resumes/software_resume.pdf' },
      [projects[0].title]: createProjectDirectory(projects[0]),
      [projects[1].title]: createProjectDirectory(projects[1]),
      [projects[2].title]: createProjectDirectory(projects[2]),
      'More Projects': {
        type: 'dir',
        children: projects.slice(3).reduce((children, project) => ({
          ...children,
          [project.title]: createProjectDirectory(project)
        }), {})
      }
    }
  }
});

const parseCommand = (commandText) => {
  const matches = commandText.matchAll(/"([^"]*)"|'([^']*)'|(\S+)/g);
  return Array.from(matches, match => match[1] ?? match[2] ?? match[3]);
};

const getPathArg = (args) => args.join(' ').replace(/\/+$/, '');

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

const TerminalContent = () => {
  const [input, setInput] = useState('');
  const [currentPath, setCurrentPath] = useState('~');
  const [output, setOutput] = useState([
    { type: 'system', text: 'Portfolio Terminal v2.0' },
    { type: 'system', text: 'Type "help" for available commands.' }
  ]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);
  const outputRef = useRef(null);
  const fileSystemRef = useRef(createFileSystem());

  const resolvePath = (target = currentPath) => {
    if (!target || target === '~') return '~';

    const rawPath = target.startsWith('~')
      ? target
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
    return 'terminal-file';
  };

  const expandWildcards = (pattern, currentDir) => {
    if (!pattern.includes('*') && !pattern.includes('?')) return [pattern];
    
    const regexString = pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.')
      .toLowerCase();
    
    const regex = new RegExp(`^${regexString}$`);
    return Object.keys(currentDir).filter(name => regex.test(name.toLowerCase()));
  };

  const commands = {
    help: () => ({
      type: 'output',
      text: 'Available commands:\n  ls - List directory contents\n  cd <dir> - Change directory\n  pwd - Print working directory\n  cat <file> - Display file contents\n  open <file> - Open a URL or PDF path\n  echo <text> - Print text\n  clear - Clear terminal\n  date - Show current date/time\n  grep <pattern> <file> - Search in file\n  head [-n] <file> - Show first lines\n  tail [-n] <file> - Show last lines\n  wc <file> - Count lines/words/chars\n  man <cmd> - Show command help\n  help - Show this help message'
    }),
    ls: () => {
      const currentDir = getCurrentDirectory();
      const items = Object.keys(currentDir).filter(name => !name.startsWith('.'));
      
      const simpleItems = items.map(name => {
        const item = currentDir[name];
        const displayName = item.type === 'dir' ? `${name}/` : name;
        const colorClass = getFileColor(name, item);
        return `<span class="${colorClass}">${displayName}</span>`;
      });
      return {
        type: 'output',
        text: simpleItems.length > 0 ? simpleItems.join('\n') : '(empty directory)',
        html: true
      };
    },
    pwd: () => ({
      type: 'output',
      text: currentPath
    }),
    cd: (args) => {
      const target = getPathArg(args) || '~';
      const targetMatch = getPathMatch(target);

      if (targetMatch && targetMatch.entry.type === 'dir') {
        setCurrentPath(targetMatch.path);
        return { type: 'output', text: '' };
      }

      return { type: 'error', text: `cd: ${target}: No such directory` };
    },
    cat: (args) => {
      const fileName = getPathArg(args);
      if (!fileName) {
        return { type: 'error', text: 'cat: missing file operand' };
      }
      const currentDir = getCurrentDirectory();
      const expanded = expandWildcards(fileName, currentDir);
      
      if (expanded.length === 1 && expanded[0] === fileName) {
        const file = fileName.includes('/') ? getNode(fileName) : currentDir[fileName];
        const resolvedFile = file || findEntry(currentDir, fileName);
        if (resolvedFile && resolvedFile.type === 'file') {
          return { type: 'output', text: resolvedFile.content };
        }
        return { type: 'error', text: `cat: ${fileName}: No such file` };
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
      const currentDir = getCurrentDirectory();
      const file = fileName.includes('/') ? getNode(fileName) : currentDir[fileName];
      const resolvedFile = file || findEntry(currentDir, fileName);
      if (!resolvedFile || resolvedFile.type !== 'file') {
        return { type: 'error', text: `open: ${fileName}: No such file` };
      }
      if (/^(https?:\/\/|\/)/.test(resolvedFile.content)) {
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
      const [pattern, fileName] = args;
      const currentDir = getCurrentDirectory();
      const expanded = expandWildcards(fileName, currentDir);
      
      if (expanded.length === 1 && expanded[0] === fileName) {
        const file = currentDir[fileName] || findEntry(currentDir, fileName);
        if (!file || file.type !== 'file') {
          return { type: 'error', text: `grep: ${fileName}: No such file` };
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
      let lines = 10;
      let fileName;
      if (args[0]?.startsWith('-n')) {
        lines = parseInt(args[0].slice(2)) || 10;
        fileName = args[1];
      } else {
        fileName = args[0];
      }
      if (!fileName) {
        return { type: 'error', text: 'head: missing file operand' };
      }
      const currentDir = getCurrentDirectory();
      const file = currentDir[fileName] || findEntry(currentDir, fileName);
      if (!file || file.type !== 'file') {
        return { type: 'error', text: `head: ${fileName}: No such file` };
      }
      const fileLines = file.content.split('\n');
      const headLines = fileLines.slice(0, lines);
      return {
        type: 'output',
        text: headLines.join('\n')
      };
    },
    tail: (args) => {
      let lines = 10;
      let fileName;
      if (args[0]?.startsWith('-n')) {
        lines = parseInt(args[0].slice(2)) || 10;
        fileName = args[1];
      } else {
        fileName = args[0];
      }
      if (!fileName) {
        return { type: 'error', text: 'tail: missing file operand' };
      }
      const currentDir = getCurrentDirectory();
      const file = currentDir[fileName] || findEntry(currentDir, fileName);
      if (!file || file.type !== 'file') {
        return { type: 'error', text: `tail: ${fileName}: No such file` };
      }
      const fileLines = file.content.split('\n');
      const tailLines = fileLines.slice(-lines);
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
      const currentDir = getCurrentDirectory();
      const file = currentDir[fileName] || findEntry(currentDir, fileName);
      if (!file || file.type !== 'file') {
        return { type: 'error', text: `wc: ${fileName}: No such file` };
      }
      const content = file.content;
      const lineCount = content.split('\n').length;
      const wordCount = content.trim().split(/\s+/).filter(w => w).length;
      const charCount = content.length;
      return {
        type: 'output',
        text: `  ${lineCount}  ${wordCount}  ${charCount} ${fileName}`
      };
    },
    man: (args) => {
      const cmdName = getPathArg(args);
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

    if (argPart === undefined) {
      const allMatches = commandNames.filter(command => command.startsWith(commandPart));
      
      if (allMatches.length === 0) return;

      if (allMatches.length === 1) {
        setInput(`${allMatches[0]} ${afterCursor}`);
      } else {
        const completedCommand = getCommonPrefix(allMatches);
        if (completedCommand !== commandPart) {
          setInput(`${completedCommand}${afterCursor}`);
        } else {
          setOutput([...output, { type: 'system', text: allMatches.join('  ') }]);
        }
      }
      return;
    }

    if (!['cd', 'cat', 'open', 'grep', 'head', 'tail', 'wc'].includes(commandPart)) return;

    const completedPath = completePath(argPart, commandPart === 'cd');
    if (!completedPath) {
      const parentMatch = argPart.includes('/') 
        ? getPathMatch(argPart.slice(0, argPart.lastIndexOf('/'))) 
        : getPathMatch(currentPath);
      
      if (parentMatch && parentMatch.entry.type === 'dir') {
        const partial = argPart.includes('/') 
          ? argPart.slice(argPart.lastIndexOf('/') + 1) 
          : argPart;
        const matches = Object.keys(parentMatch.node)
          .filter(name => name.toLowerCase().startsWith(partial.toLowerCase()));
        
        if (matches.length > 1) {
          const prefix = argPart.includes('/') ? argPart.slice(0, argPart.lastIndexOf('/') + 1) : '';
          setOutput([...output, { type: 'system', text: matches.map(m => prefix + m).join('  ') }]);
        }
      }
      return;
    }

    setInput(`${commandPart} ${completedPath}${afterCursor}`);
  };

  useEffect(() => {
    if (terminalRef.current) {
      const windowContent = terminalRef.current.closest('.window-content');
      if (windowContent) {
        windowContent.scrollTop = windowContent.scrollHeight;
      }
    }
  }, [output]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      handleTabCompletion(e);
    } else if (e.key === 'Enter') {
      const trimmedInput = input.trim();
      if (trimmedInput) {
        setCommandHistory([...commandHistory, trimmedInput]);
        setHistoryIndex(-1);

        const parts = parseCommand(trimmedInput);
        const cmd = parts[0];
        const args = parts.slice(1);
        
        const commandFunc = commands[cmd];

        let newOutput = [...output, { type: 'command', path: currentPath, text: trimmedInput }];

        if (commandFunc) {
          const result = commandFunc(args);
          if (result) {
            if (result.type === 'clear') {
              setOutput([]);
            } else {
              newOutput = result.text ? [...newOutput, result] : newOutput;
              setOutput(newOutput);
            }
          }
        } else {
          newOutput = [...newOutput, { type: 'error', text: `Command not found: ${cmd}` }];
          setOutput(newOutput);
        }
      }
      setInput('');
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
            ) : line.html ? (
              <span dangerouslySetInnerHTML={{ __html: line.text }} />
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

export const terminalWindow = {
  id: 'terminalWindow',
  title: 'Terminal',
  label: 'Terminal',
  color: '#333',
  component: TerminalContent
};
