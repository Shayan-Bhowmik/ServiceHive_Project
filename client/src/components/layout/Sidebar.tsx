import { NavLink } from 'react-router-dom';

export const Sidebar = (): JSX.Element => {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-slate-950/70 px-4 py-6 lg:block">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glow">
        <p className="text-xs uppercase tracking-[0.35em] text-brand-300">Workspace</p>
        <div className="mt-2 text-lg font-semibold text-white">Sales cockpit</div>
        <p className="mt-2 text-sm text-slate-400">Track leads, filter by source, and move faster without losing context.</p>
      </div>
      <nav className="mt-6 space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            [
              'block rounded-2xl px-4 py-3 text-sm font-medium transition',
              isActive ? 'bg-brand-500 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
            ].join(' ')
          }
        >
          Leads Dashboard
        </NavLink>
      </nav>
    </aside>
  );
};
