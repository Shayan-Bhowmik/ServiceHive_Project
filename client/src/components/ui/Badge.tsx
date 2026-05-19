import { cn } from '@/utils/cn';
import type { LeadStatus } from '@/types/lead';

interface BadgeProps {
  status: LeadStatus;
}

const statusClasses: Record<LeadStatus, string> = {
  New: 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/30',
  Contacted: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30',
  Qualified: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30',
  Lost: 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/30'
};

export const Badge = ({ status }: BadgeProps): JSX.Element => {
  return (
    <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-semibold', statusClasses[status])}>
      {status}
    </span>
  );
};
