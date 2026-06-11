import React, { useState, useEffect, useRef } from 'react';

interface CounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  startFrom?: number;
}

const Counter: React.FC<CounterProps> = ({ value, suffix = '', duration = 2000, startFrom = 0 }) => {
  const [count, setCount] = useState(startFrom);
  const [hasStarted, setHasStarted] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = counterRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let animationFrame: number;
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(startFrom + eased * (value - startFrom));
      setCount(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => { if (animationFrame) cancelAnimationFrame(animationFrame); };
  }, [hasStarted, value, duration, startFrom]);

  return (
    <div ref={counterRef} className="text-3xl font-black text-brand-text">
      {count}{suffix}
    </div>
  );
};

export default Counter;