import { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    if (replace) {
      const newArr = [...history];
      newArr[newArr.length - 1] = newMode;
      setHistory(newArr);
    } else {
      setHistory((prev) => [...prev, newMode]);
    }
    setMode(newMode);
  };

  const back = () => {
    if (history.length - 1) {
      const newArr = [...history];
      newArr.pop();
      setHistory(newArr);
      setMode(newArr[newArr.length - 1]);
    }
  };

  return { mode, transition, back };
}
