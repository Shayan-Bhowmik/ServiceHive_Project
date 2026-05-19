import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = ({ label, error, className, id, children, ...rest }: SelectProps): JSX.Element => {
  const selectId = id ?? rest.name;

  return (
    <label className="flex w-full flex-col gap-2 text-sm text-slate-200" htmlFor={selectId}>
      {label ? <span className="font-medium text-slate-100">{label}</span> : null}
      <select
        id={selectId}
        className={cn(
          'h-11 rounded-xl border border-white/10 bg-slate-900/80 px-4 text-slate-100 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20',
          error ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : '',
          className
        )}
        {...rest}
      >
        {children}
      </select>
      {error ? <span className="text-xs text-rose-300">{error}</span> : null}
    </label>
  );
};
