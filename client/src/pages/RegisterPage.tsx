import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/hooks/useAuth';
import type { RegisterRequestBody } from '@/types/auth';

interface RegisterFormErrors {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  form?: string;
}

const validateRegisterForm = (values: RegisterRequestBody): RegisterFormErrors => {
  const errors: RegisterFormErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }

  if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  if (values.password.trim().length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  return errors;
};

export const RegisterPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [values, setValues] = useState<RegisterRequestBody>({
    name: '',
    email: '',
    password: '',
    role: 'sales'
  });
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const nextErrors = validateRegisterForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      await register(values);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : 'Unable to register' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-4 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-brand-300">Smart Leads</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Create your account</h1>
          <p className="mt-2 text-sm text-slate-400">Start tracking leads with a secure workspace.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            label="Name"
            name="name"
            value={values.name}
            onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
            error={errors.name}
            placeholder="Rahul Sharma"
          />
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
            placeholder="At least 6 characters"
          />
          <Select
            label="Role"
            name="role"
            value={values.role}
            onChange={(event) => setValues((current) => ({ ...current, role: event.target.value as RegisterRequestBody['role'] }))}
          >
            <option value="sales">Sales</option>
            <option value="admin">Admin</option>
          </Select>
          {errors.form ? <p className="text-sm text-rose-300">{errors.form}</p> : null}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
        <p className="mt-6 text-sm text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="font-medium text-brand-300 hover:text-brand-200">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
