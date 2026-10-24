import { useEffect, useRef, useState } from 'react';

export default function TypewriterText({ text, speed = 30, startOnView = false }) {
  const textRef = useRef(null);
  const [shouldType, setShouldType] = useState(false);
  const [visibleText, setVisibleText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!startOnView || !('IntersectionObserver' in window)) {
      setShouldType(true);
      return undefined;
    }

    const target = textRef.current?.parentElement?.parentElement ?? textRef.current;
    if (!target) return undefined;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setShouldType(true);
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(target);
    return () => observer.disconnect();
  }, [startOnView, text]);

  useEffect(() => {
    if (!shouldType) return undefined;
    setVisibleText('');
    setIsTyping(true);
    let index = 0;
    let timeout;
    const typeNext = () => {
      index += 1;
      setVisibleText(text.slice(0, index));
      if (index >= text.length) {
        setIsTyping(false);
        return;
      }
      timeout = window.setTimeout(typeNext, speed);
    };
    timeout = window.setTimeout(typeNext, 180);
    return () => window.clearTimeout(timeout);
  }, [shouldType, speed, text]);

  return (
    <span ref={textRef} className="typewriter" aria-label={text}>
      <span className="typewriter-reserve" aria-hidden="true">{text}</span>
      <span className="typewriter-visible" aria-hidden="true">
        {visibleText}{isTyping && <span className="typewriter-caret" />}
      </span>
    </span>
  );
}
