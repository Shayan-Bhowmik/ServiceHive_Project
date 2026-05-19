import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';

export const Navbar = (): JSX.Element => {
  const { user, logout } = useAuth();
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error('Navbar must be rendered within a ThemeProvider');
  }

  const { theme, toggleTheme } = themeContext;

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-brand-300">Smart Leads</p>
          <h1 className="text-lg font-semibold text-white">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-slate-400">{user?.role}</p>
          </div>
          <Button variant="secondary" size="sm" onClick={toggleTheme}>
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </Button>
          <Button variant="ghost" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
