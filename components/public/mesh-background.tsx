'use client';

import { useEffect, useState } from 'react';

type Props = {
  colors?: string[];
  baseColor?: string;
  opacity?: number;
};

const DEFAULT_COLORS = [
  '#ff7e5f', '#f59e0b', '#ec4899', '#a78bfa', '#60a5fa',
  '#34d399', '#d946ef', '#f97316', '#fb7185', '#818cf8',
];

const DEFAULT_BASE = '#fff5ee';

const ORB_POSITIONS = [
  { cx: 1050, cy: 100, r: 340, op: 0.7 },
  { cx: 180, cy: 60, r: 300, op: 0.55 },
  { cx: 1150, cy: 420, r: 320, op: 0.5 },
  { cx: 580, cy: 380, r: 380, op: 0.55 },
  { cx: 120, cy: 680, r: 340, op: 0.45 },
  { cx: 680, cy: 800, r: 300, op: 0.4 },
  { cx: 480, cy: 80, r: 250, op: 0.45 },
  { cx: 1250, cy: 720, r: 280, op: 0.5 },
  { cx: 300, cy: 350, r: 260, op: 0.4 },
  { cx: 900, cy: 200, r: 220, op: 0.35 },
];

// Cycle through orb animation classes (1–8)
function orbClass(idx: number) {
  return `mesh-orb mesh-orb--${(idx % 8) + 1}`;
}

export function MeshBackground({ colors, baseColor, opacity }: Props) {
  const meshColors = colors ?? DEFAULT_COLORS;
  const base = baseColor ?? DEFAULT_BASE;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  // Mobile: use fewer orbs (6 instead of 10) and skip noise overlay
  const orbs = isMobile ? ORB_POSITIONS.slice(0, 6) : ORB_POSITIONS;

  return (
    <div className="mesh-bg" aria-hidden="true" style={opacity !== undefined ? { opacity } : undefined}>
      <svg
        viewBox="0 0 1400 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="mesh-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation={isMobile ? '80' : '100'} />
          </filter>
          {!isMobile && (
            <filter id="mesh-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
              <feBlend in="SourceGraphic" mode="soft-light" />
            </filter>
          )}
        </defs>

        <rect width="1400" height="900" fill={base} />

        <g filter="url(#mesh-blur)">
          {orbs.map((orb, idx) => (
            <circle
              key={idx}
              className={orbClass(idx)}
              cx={orb.cx}
              cy={orb.cy}
              r={orb.r}
              fill={meshColors[idx % meshColors.length]}
              opacity={orb.op}
            />
          ))}
        </g>

        {!isMobile && (
          <rect width="1400" height="900" filter="url(#mesh-noise)" opacity="0.04" />
        )}
      </svg>

      <div className="mesh-fade" />
    </div>
  );
}
