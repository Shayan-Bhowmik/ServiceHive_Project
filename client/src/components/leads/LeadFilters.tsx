import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { LeadFiltersState } from '@/types/lead';

interface LeadFiltersProps {
  filters: LeadFiltersState;
  onChange: <K extends keyof LeadFiltersState>(field: K, value: LeadFiltersState[K]) => void;
}

export const LeadFilters = ({ filters, onChange }: LeadFiltersProps): JSX.Element => {
  return (
    <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl shadow-black/10 lg:grid-cols-4">
      <Input
        label="Search"
        name="search"
        value={filters.search}
        onChange={(event) => onChange('search', event.target.value)}
        placeholder="Search by name or email"
      />
      <Select label="Status" name="status" value={filters.status} onChange={(event) => onChange('status', event.target.value as LeadFiltersState['status'])}>
        <option value="">All statuses</option>
        <option value="New">New</option>
        <option value="Contacted">Contacted</option>
        <option value="Qualified">Qualified</option>
        <option value="Lost">Lost</option>
      </Select>
      <Select label="Source" name="source" value={filters.source} onChange={(event) => onChange('source', event.target.value as LeadFiltersState['source'])}>
        <option value="">All sources</option>
        <option value="Website">Website</option>
        <option value="Instagram">Instagram</option>
        <option value="Referral">Referral</option>
      </Select>
      <Select label="Sort" name="sort" value={filters.sort} onChange={(event) => onChange('sort', event.target.value as LeadFiltersState['sort'])}>
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
      </Select>
    </div>
  );
};
