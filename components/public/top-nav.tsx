import Link from 'next/link';

export function TopNav() {
  return (
    <header className="top-nav">
      <Link href="/" className="brand">
        thisis.at
      </Link>
      <nav className="nav-links" aria-label="Primary">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/editor/@lucid.band">Editor</Link>
        <Link href="/@lucid.band">Example Profile</Link>
      </nav>
    </header>
  );
}
