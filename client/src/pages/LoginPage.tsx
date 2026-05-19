import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import type { LoginRequestBody } from '@/types/auth';

interface LoginFormErrors {
  email?: string;
  password?: string;
  form?: string;
}

const validateLoginForm = (values: LoginRequestBody): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  if (values.password.trim().length === 0) {
    errors.password = 'Password is required';
  }

  return errors;
};

export const LoginPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [values, setValues] = useState<LoginRequestBody>({ email: '', password: '' });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const nextErrors = validateLoginForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      await login(values);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : 'Unable to login' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-4 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-brand-300">Smart Leads</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to continue managing your sales pipeline.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            name="email"
            value={values.email}
            onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
            error={errors.email}
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={values.password}
            onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))}
            error={errors.password}
            placeholder="••••••••"
          />
          {errors.form ? <p className="text-sm text-rose-300">{errors.form}</p> : null}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        <p className="mt-6 text-sm text-slate-400">
          New here?{' '}
          <Link to="/register" className="font-medium text-brand-300 hover:text-brand-200">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
