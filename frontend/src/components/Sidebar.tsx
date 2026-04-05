'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface SidebarProps {
  role: 'admin' | 'user';
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const adminLinks = [
    { href: '/admin', label: 'Home', icon: '🏠' },
    { href: '/admin/history', label: 'History', icon: '📋' },
  ];

  const userLinks = [
    { href: '/user', label: 'Home', icon: '🏠' },
    { href: '/user/history', label: 'History', icon: '📋' },
  ];

  const links = role === 'admin' ? adminLinks : userLinks;
  const switchTo = role === 'admin' ? '/user' : '/admin';
  const switchLabel = role === 'admin' ? 'Switch to user' : 'Switch to Admin';

  return (
    <>
      <button
        className="sidebar-toggle md:hidden"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <h2 className="sidebar__title">{role === 'admin' ? 'Admin' : 'User'}</h2>
        </div>

        <nav className="sidebar__nav">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`sidebar__link ${pathname === link.href ? 'sidebar__link--active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar__footer">
          <Link href={switchTo} className="sidebar__link" onClick={() => setOpen(false)}>
            🔄 {switchLabel}
          </Link>
          <Link href="/" className="sidebar__link" onClick={() => setOpen(false)}>
            🚪 Logout
          </Link>
        </div>
      </aside>

      {open && <div className="sidebar-overlay md:hidden" onClick={() => setOpen(false)} />}
    </>
  );
}
