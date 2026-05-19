import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export const NotFoundPage = (): JSX.Element => {
  return (
    <div className="grid min-h-screen place-items-center px-4 py-12 text-center">
      <div className="max-w-lg rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.35em] text-brand-300">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Page not found</h1>
        <p className="mt-2 text-sm text-slate-400">The page you’re looking for doesn’t exist.</p>
        <Link to="/dashboard" className="mt-6 inline-block">
          <Button>Go to dashboard</Button>
        </Link>
      </div>
    </div>
  );
};
