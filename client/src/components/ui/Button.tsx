import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-brand-500 text-white shadow-glow hover:bg-brand-400 focus-visible:ring-brand-400',
  secondary:
    'border border-white/10 bg-white/5 text-white hover:bg-white/10 focus-visible:ring-white/20',
  ghost:
    'bg-transparent text-slate-200 hover:bg-white/10 focus-visible:ring-white/20',
  danger:
    'bg-rose-500 text-white hover:bg-rose-400 focus-visible:ring-rose-400'
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-base'
};

export const Button = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...rest
}: PropsWithChildren<ButtonProps>): JSX.Element => {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
