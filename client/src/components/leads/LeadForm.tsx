import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { LeadFormErrors, LeadFormValues } from '@/types/lead';
import type { Lead } from '@/types/lead';

interface LeadFormProps {
  initialValues?: LeadFormValues;
  onSubmit: (values: LeadFormValues) => Promise<void> | void;
  submitting?: boolean;
  submitLabel: string;
}

const defaultValues: LeadFormValues = {
  name: '',
  email: '',
  status: 'New',
  source: 'Website'
};

const validateLeadForm = (values: LeadFormValues): LeadFormErrors => {
  const errors: LeadFormErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }

  if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  if (!values.status) {
    errors.status = 'Status is required';
  }

  if (!values.source) {
    errors.source = 'Source is required';
  }

  return errors;
};

export const LeadForm = ({
  initialValues,
  onSubmit,
  submitting = false,
  submitLabel
}: LeadFormProps): JSX.Element => {
  const [values, setValues] = useState<LeadFormValues>(initialValues ?? defaultValues);
  const [errors, setErrors] = useState<LeadFormErrors>({});

  useEffect(() => {
    setValues(initialValues ?? defaultValues);
    setErrors({});
  }, [initialValues]);

  const handleChange = <K extends keyof LeadFormValues>(field: K, nextValue: LeadFormValues[K]): void => {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: nextValue
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const nextErrors = validateLeadForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit({
      name: values.name.trim(),
      email: values.email.trim(),
      status: values.status,
      source: values.source
    });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Name"
          name="name"
          value={values.name}
          onChange={(event) => handleChange('name', event.target.value)}
          error={errors.name}
          placeholder="Rahul Sharma"
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={(event) => handleChange('email', event.target.value)}
          error={errors.email}
          placeholder="rahul@example.com"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Status"
          name="status"
          value={values.status}
          onChange={(event) => handleChange('status', event.target.value as Lead['status'])}
          error={errors.status}
        >
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Lost">Lost</option>
        </Select>
        <Select
          label="Source"
          name="source"
          value={values.source}
          onChange={(event) => handleChange('source', event.target.value as Lead['source'])}
          error={errors.source}
        >
          <option value="Website">Website</option>
          <option value="Instagram">Instagram</option>
          <option value="Referral">Referral</option>
        </Select>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};
