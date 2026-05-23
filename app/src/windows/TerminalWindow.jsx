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
    title: 'Computer Vision Spell Casting',
    description: 'Built a distributed edge-AI interactive system combining a custom Android app and embedded hardware to detect gesture-based spells using computer vision and speech recognition.',
    technologies: 'Python, AI/ML, Computer Vision, Arduino UNO Q, Linux, Microcontroller',
    github: 'https://github.com/BenMiller0/computer_vision_spell_casting',
    photos: ['wand_spell_caster.jpg', 'full_wand_system.jpg'],
    miscLink: { displayName: 'Project Page', url: 'https://devpost.com/software/muggle-wand-training' }
  },
  {
    title: 'Darth Vader Suit Firmware',
    description: 'Darth Vader suit firmware built on FreeRTOS. Controls programmable blinking lights on a screen-accurate suit used by Star Wars Club at UC San Diego.',
    technologies: 'C++, FreeRTOS, ESP32, PWM',
    github: 'https://github.com/BenMiller0/darth-vadar-firmware',
    photos: ['vader_suit.jpg', 'vader_embedded.jpg']
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
      'about_me.txt': {
        type: 'file',
        content: 'Benjamin Miller\nUC San Diego - Computer Science\nEmbedded Systems & Software Engineer'
      },
      'README.txt': {
        type: 'file',
        content: 'This portfolio is designed to look and feel like a desktop environment, showcasing projects in embedded systems, AI/ML, and app/web app development.'
      },
      'experience.txt': {
        type: 'file',
        content: [
          'Electronic Props Designer, Star Wars Club at UCSD',
          'Software Engineering Lead & VP, Themed Entertainment Association at UCSD',
          'Software Engineering Intern, Western Digital',
          'Software Developer Intern, Center for Applied Internet Data Analysis',
          'Resident Advisor, COSMOS UC San Diego'
        ].join('\n')
      },
      'Terminal.app': { type: 'file', content: 'Portfolio terminal window' },
      'GitHub.url': { type: 'file', content: 'https://github.com/BenMiller0' },
      'LinkedIn.url': { type: 'file', content: 'https://linkedin.com/in/benjamin-miller-ucsd' },
      'Hardware_Resume.pdf': { type: 'file', content: '/hardware_resume.pdf' },
      'Software_Resume.pdf': { type: 'file', content: '/software_resume.pdf' },
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
    { type: 'system', text: 'Portfolio Terminal v1.0' },
    { type: 'system', text: 'Type "help" for available commands.' }
  ]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);
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

  const commands = {
    help: () => ({
      type: 'output',
      text: 'Available commands:\n  ls - List directory contents\n  cd <dir> - Change directory\n  pwd - Print working directory\n  cat <file> - Display file contents\n  open <file> - Open a URL or PDF path\n  echo <text> - Print text\n  clear - Clear terminal\n  date - Show current date/time\n  help - Show this help message'
    }),
    ls: () => {
      const currentDir = getCurrentDirectory();
      const items = Object.keys(currentDir).map(name => {
        const item = currentDir[name];
        return item.type === 'dir' ? `${name}/` : name;
      });
      return {
        type: 'output',
        text: items.length > 0 ? items.join('\n') : '(empty directory)'
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
      const file = fileName.includes('/') ? getNode(fileName) : currentDir[fileName];
      const resolvedFile = file || findEntry(currentDir, fileName);
      if (resolvedFile && resolvedFile.type === 'file') {
        return { type: 'output', text: resolvedFile.content };
      }
      return { type: 'error', text: `cat: ${fileName}: No such file` };
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
      const commandMatches = commandNames.filter(command => command.startsWith(commandPart));
      if (commandMatches.length === 0) return;

      const completedCommand = commandMatches.length === 1
        ? `${commandMatches[0]} `
        : getCommonPrefix(commandMatches);

      setInput(`${completedCommand}${afterCursor}`);
      return;
    }

    if (!['cd', 'cat', 'open'].includes(commandPart)) return;

    const completedPath = completePath(argPart, commandPart === 'cd');
    if (!completedPath) return;

    setInput(`${commandPart} ${completedPath}${afterCursor}`);
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
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
      <div className="terminal-output">
        {output.map((line, index) => (
          <div key={index} className={`terminal-line terminal-${line.type}`}>
            {line.type === 'command' ? (
              <>
                {renderPrompt(line.path)}
                <span className="terminal-command-text"> {line.text}</span>
              </>
            ) : line.text}
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
