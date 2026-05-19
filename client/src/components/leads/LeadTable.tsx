import type { Lead } from '@/types/lead';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/formatDate';

interface LeadTableProps {
  leads: Lead[];
  canEditLead: (lead: Lead) => boolean;
  canDeleteLead: (lead: Lead) => boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onView: (lead: Lead) => void;
}

export const LeadTable = ({
  leads,
  canEditLead,
  canDeleteLead,
  onEdit,
  onDelete,
  onView
}: LeadTableProps): JSX.Element => {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/75 shadow-2xl shadow-black/20">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left">
          <thead className="bg-white/5 text-xs uppercase tracking-[0.25em] text-slate-400">
            <tr>
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Email</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Source</th>
              <th className="px-5 py-4">Created At</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/8 text-sm text-slate-200">
            {leads.map((lead) => (
              <tr key={lead.id} className="transition hover:bg-white/5">
                <td className="px-5 py-4 font-medium text-white">
                  <button className="text-left hover:text-brand-300" onClick={() => onView(lead)}>
                    {lead.name}
                  </button>
                </td>
                <td className="px-5 py-4 text-slate-300">{lead.email}</td>
                <td className="px-5 py-4">
                  <Badge status={lead.status} />
                </td>
                <td className="px-5 py-4 text-slate-300">{lead.source}</td>
                <td className="px-5 py-4 text-slate-300">{formatDate(lead.createdAt)}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    {canEditLead(lead) ? (
                      <Button variant="secondary" size="sm" onClick={() => onEdit(lead)}>
                        Edit
                      </Button>
                    ) : null}
                    {canDeleteLead(lead) ? (
                      <Button variant="danger" size="sm" onClick={() => onDelete(lead)}>
                        Delete
                      </Button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
