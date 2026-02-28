'use client';

import { MeshBackground } from './mesh-background';
import { SparkleLayer } from './sparkle-layer';

type Props = {
  children: React.ReactNode;
};

export function DefaultShell({ children }: Props) {
  return (
    <div className="shell">
      <MeshBackground />
      <SparkleLayer />
      {children}
    </div>
  );
}
