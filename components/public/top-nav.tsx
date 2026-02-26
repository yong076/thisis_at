import Link from 'next/link';

export function TopNav() {
  return (
    <header className="top-nav">
      <Link href="/" className="brand">
        thisis.at
      </Link>
      <nav className="nav-links" aria-label="Primary">
        <Link href="/@lucid.band" className="nav-link">
          데모
        </Link>
        <Link href="/admin" className="nav-link nav-link--cta">
          대시보드
        </Link>
      </nav>
    </header>
  );
}
