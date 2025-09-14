'use client';

import { useEffect, useState } from 'react';

export function Greeting({ name }: { name: string }) {
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 22) return 'Good evening';
    return 'Good night';
  };

  const greeting = getTimeBasedGreeting();
  const fullText = `${greeting}, ${name}.`;

  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + fullText.charAt(index));
        setIndex(index + 1);
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      setDone(true);
    }
  }, [index, fullText]);

  const commaIndex = displayText.indexOf(',');
  const greetingPart = commaIndex !== -1 ? displayText.slice(0, commaIndex) : displayText;
  const namePart = commaIndex !== -1 ? displayText.slice(commaIndex + 2) : '';

  return (
    <h1 className="text-center text-base font-medium sm:text-lg md:text-2xl">
      <span className="text-[#6B0F1A] dark:text-[#ffc82e]">{greetingPart}</span>
      {commaIndex !== -1 && <span className="text-[#6B0F1A] dark:text-[#ffc82e]">, </span>}
      <span className="text-foreground font-semibold">{namePart}</span>
      {!done && <span className="animate-pulse">|</span>}
    </h1>
  );
}
