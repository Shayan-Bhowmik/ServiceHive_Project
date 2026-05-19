import type { InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className, id, ...rest }: InputProps): JSX.Element => {
  const inputId = id ?? rest.name;

  return (
    <label className="flex w-full flex-col gap-2 text-sm text-slate-200" htmlFor={inputId}>
      {label ? <span className="font-medium text-slate-100">{label}</span> : null}
      <input
        id={inputId}
        className={cn(
          'h-11 rounded-xl border border-white/10 bg-slate-900/80 px-4 text-slate-100 placeholder:text-slate-500 shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20',
          error ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : '',
          className
        )}
        {...rest}
      />
      {error ? <span className="text-xs text-rose-300">{error}</span> : null}
    </label>
  );
};
