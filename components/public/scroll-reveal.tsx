'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: '100' | '200' | '300' | '400';
  /** If true, starts visible (no initial flash). Use for above-the-fold content. */
  instant?: boolean;
}

export function ScrollReveal({ children, className = '', delay, instant }: ScrollRevealProps) {
  // Start visible on server to prevent flash, observer will handle below-fold items
  const [isVisible, setIsVisible] = useState(!!instant);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If already visible (instant), skip observer
    if (instant) return;

    const el = ref.current;
    if (!el) return;

    // If element is already in viewport on mount, show immediately (no flash)
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [instant]);

  const delayClass = delay ? `delay-${delay}` : '';

  return (
    <div
      ref={ref}
      className={`reveal-on-scroll ${isVisible ? 'is-visible' : ''} ${delayClass} ${className}`}
    >
      {children}
    </div>
  );
}
