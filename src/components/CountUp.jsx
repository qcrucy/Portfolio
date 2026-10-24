import { useEffect, useRef, useState } from 'react';

export default function CountUp({ value, unit }) {
  const [started, setStarted] = useState(false);
  const [count, setCount] = useState(0);
  const numberRef = useRef(null);

  useEffect(() => {
    const number = numberRef.current;
    if (!number) return undefined;

    if (!('IntersectionObserver' in window)) {
      setStarted(true);
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setStarted(true);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(number);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return undefined;

    const duration = (value * 700) + 300;
    const start = performance.now();
    let frame;
    const update = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const nextCount = Math.floor(value * progress);
      setCount((current) => current === nextCount ? current : nextCount);
      if (progress < 1) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [started, value]);

  return (
    <div ref={numberRef} className="stat-number-wrap">
      <strong aria-label={`${value} ${unit}`}>
        <span key={count} className="count-value" aria-hidden="true">{count}</span>
        <span className="stat-unit" aria-hidden="true">{unit}</span>
      </strong>
    </div>
  );
}
