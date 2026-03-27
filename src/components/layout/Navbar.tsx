import { Link, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Students', path: '/students' },
  { label: 'Faculty', path: '/faculty' },
  { label: 'Courses', path: '/courses' },
  { label: 'Billing', path: '/billing' },
];

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="no-print sticky top-[30px] z-50 mx-auto mt-4 flex w-fit min-w-[720px] max-w-[95vw] items-center justify-between gap-6 px-6 py-3 glass-surface">
      <Link to="/dashboard" className="font-display text-lg font-bold text-[var(--text-primary)]">
        UniPortal
      </Link>

      <div className="flex items-center gap-1">
        {navLinks.map(link => {
          const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/');
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'text-[var(--accent-blue-solid)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {link.label}
              {isActive && (
                <span className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--accent-blue-solid)]" />
              )}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-blue)] text-xs font-bold text-white">
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <span className="text-sm font-medium text-[var(--text-primary)] hidden md:inline">{user.name}</span>
          </>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] glass-surface glass-surface-hover transition-colors"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </nav>
  );
};
