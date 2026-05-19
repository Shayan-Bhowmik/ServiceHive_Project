import type { ReactNode } from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon
}: EmptyStateProps): JSX.Element => {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-950/60 px-6 py-12 text-center">
      {icon ? <div className="mb-4 text-brand-300">{icon}</div> : null}
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-400">{description}</p>
      {actionLabel && onAction ? (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
};
