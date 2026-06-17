import { useEffect, useState } from 'react';

export const useTypewriter = (text, delay = 50, startDelay = 0) => {
  const [value, setValue] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setValue('');
    setDone(false);

    let index = 0;
    let timerId;
    let typingTimerId;

    const typeNextCharacter = () => {
      if (index < text.length) {
        setValue(text.slice(0, index + 1));
        index += 1;
        typingTimerId = window.setTimeout(typeNextCharacter, delay);
      } else {
        setDone(true);
      }
    };

    timerId = window.setTimeout(typeNextCharacter, startDelay);

    return () => {
      window.clearTimeout(timerId);
      window.clearTimeout(typingTimerId);
    };
  }, [delay, startDelay, text]);

  return { value, done };
};
