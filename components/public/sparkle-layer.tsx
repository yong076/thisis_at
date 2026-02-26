'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
}

const COLORS = [
  '#f97316', '#ec4899', '#8b5cf6',
  '#60a5fa', '#fbbf24', '#34d399',
  '#f472b6', '#a78bfa',
];

export function SparkleLayer() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const count = reducedMotion ? 8 : 28;

    const generated: Particle[] = [];
    for (let i = 0; i < count; i++) {
      generated.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 6,
        duration: 3 + Math.random() * 5,
      });
    }
    setParticles(generated);
  }, []);

  return (
    <div className="sparkle-layer" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="sparkle-dot"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}40`,
          }}
        />
      ))}
    </div>
  );
}
