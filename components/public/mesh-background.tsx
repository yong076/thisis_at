'use client';

export function MeshBackground() {
  return (
    <div className="mesh-bg" aria-hidden="true">
      <svg
        viewBox="0 0 1400 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="mesh-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="100" />
          </filter>
          <filter id="mesh-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="soft-light" />
          </filter>
        </defs>

        {/* Base warm tint */}
        <rect width="1400" height="900" fill="#fff5ee" />

        {/* Mesh gradient blobs — vivid & lush */}
        <g filter="url(#mesh-blur)">
          {/* Top-right: vivid coral */}
          <circle className="mesh-orb mesh-orb--1" cx="1050" cy="100" r="340" fill="#ff7e5f" opacity="0.7" />

          {/* Top-left: golden amber */}
          <circle className="mesh-orb mesh-orb--2" cx="180" cy="60" r="300" fill="#f59e0b" opacity="0.55" />

          {/* Center-right: hot pink */}
          <circle className="mesh-orb mesh-orb--3" cx="1150" cy="420" r="320" fill="#ec4899" opacity="0.5" />

          {/* Center: rich lavender */}
          <circle className="mesh-orb mesh-orb--4" cx="580" cy="380" r="380" fill="#a78bfa" opacity="0.55" />

          {/* Bottom-left: sky blue */}
          <circle className="mesh-orb mesh-orb--5" cx="120" cy="680" r="340" fill="#60a5fa" opacity="0.45" />

          {/* Bottom-center: emerald mint */}
          <circle className="mesh-orb mesh-orb--6" cx="680" cy="800" r="300" fill="#34d399" opacity="0.4" />

          {/* Top-center: fuchsia / magenta */}
          <circle className="mesh-orb mesh-orb--7" cx="480" cy="80" r="250" fill="#d946ef" opacity="0.45" />

          {/* Bottom-right: tangerine orange */}
          <circle className="mesh-orb mesh-orb--8" cx="1250" cy="720" r="280" fill="#f97316" opacity="0.5" />

          {/* Extra: center-left rose for richness */}
          <circle className="mesh-orb mesh-orb--3" cx="300" cy="350" r="260" fill="#fb7185" opacity="0.4" />

          {/* Extra: top-right blue-violet accent */}
          <circle className="mesh-orb mesh-orb--6" cx="900" cy="200" r="220" fill="#818cf8" opacity="0.35" />
        </g>

        {/* Subtle grain texture */}
        <rect width="1400" height="900" filter="url(#mesh-noise)" opacity="0.04" />
      </svg>

      {/* Bottom fade to base */}
      <div className="mesh-fade" />
    </div>
  );
}
