import { useEffect, useState } from 'react';

export const useTypewriter = (text, delay = 50, startDelay = 0) => {
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const [value, setValue] = useState(reduceMotion ? text : '');
  const [done, setDone] = useState(reduceMotion);

  useEffect(() => {
    if (reduceMotion) {
      setValue(text);
      setDone(true);
      return undefined;
    }

    setValue('');
    setDone(false);
    let index = 0;
    let timerId;

    const typeNextCharacter = () => {
      if (index < text.length) {
        setValue(text.slice(0, index + 1));
        index += 1;
        timerId = window.setTimeout(typeNextCharacter, delay);
      } else {
        setDone(true);
      }
    };

    timerId = window.setTimeout(typeNextCharacter, startDelay);
    return () => window.clearTimeout(timerId);
  }, [delay, reduceMotion, startDelay, text]);

  return { value, done };
};
