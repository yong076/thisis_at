'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', icon: '📊' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/profiles', label: 'Profiles', icon: '🔗' },
  { href: '/admin/blocks', label: 'Blocks', icon: '🧩' },
  { href: '/admin/events', label: 'Events', icon: '📅' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
  { href: '/admin/categories', label: 'Categories', icon: '🏷️' },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  return (
    <div className="adm-shell">
      <aside className="adm-sidebar">
        <Link href="/" className="adm-sidebar-brand">thisis.at</Link>
        <span className="adm-sidebar-badge">Admin</span>
        <nav className="adm-sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`adm-sidebar-link${isActive(item.href) ? ' adm-sidebar-link--active' : ''}`}
            >
              <span className="adm-sidebar-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="adm-sidebar-footer">
          <button
            className="btn-logout"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            로그아웃
          </button>
        </div>
      </aside>
      <main className="adm-main">
        {children}
      </main>
    </div>
  );
}
