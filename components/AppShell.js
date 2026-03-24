'use client';

import { useAuth } from '@/lib/auth-context';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NAV_ITEMS = [
  { href: '/', icon: '⌂', activeIcon: '⌂', label: 'Feed' },
  { href: '/explore', icon: '◎', activeIcon: '◎', label: 'Explore' },
  { href: '/projects/new', icon: '✦', activeIcon: '✦', label: 'New' },
  { href: '/profile', icon: '○', activeIcon: '●', label: 'Profile' },
];

export default function AppShell({ children }) {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return children;

  return (
    <div className="app-layout">
      <main className="app-content">{children}</main>

      <nav className="bottom-nav">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
              aria-label={item.label}
            >
              <span className="nav-icon">{isActive ? item.activeIcon : item.icon}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
