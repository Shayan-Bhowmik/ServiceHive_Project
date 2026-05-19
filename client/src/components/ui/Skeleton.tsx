import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps): JSX.Element => {
  return <div className={cn('animate-pulse rounded-2xl bg-white/8', className)} />;
};
