'use client';

import { useRef, useEffect, useState, type ReactNode } from 'react';
import { TiltCard } from './tilt-card';

type Props = {
  children: ReactNode;
  index: number;
  staggerMs?: number;
};

export function AnimatedBlock({ children, index, staggerMs = 80 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`block-entrance ${isVisible ? 'block-entrance--visible' : ''}`}
      style={{ transitionDelay: `${index * staggerMs}ms` }}
    >
      <TiltCard>{children}</TiltCard>
    </div>
  );
}
