import type { PropsWithChildren } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const Layout = ({ children }: PropsWithChildren): JSX.Element => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute right-[-5%] top-32 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(38,179,93,0.1),_transparent_32%),linear-gradient(180deg,_rgba(15,23,42,0.94),_rgba(2,6,23,1))]" />
      </div>
      <Navbar />
      <div className="mx-auto flex max-w-[1600px]">
        <Sidebar />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
};
