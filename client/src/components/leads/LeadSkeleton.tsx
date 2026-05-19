import { Skeleton } from '@/components/ui/Skeleton';

export const LeadSkeleton = (): JSX.Element => {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/75 p-4 shadow-2xl shadow-black/20">
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <div className="grid gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
};
