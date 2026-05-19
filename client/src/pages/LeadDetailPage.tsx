import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { LeadSkeleton } from '@/components/leads/LeadSkeleton';
import { useAuth } from '@/hooks/useAuth';
import { useLead } from '@/hooks/useLeads';
import { formatDate } from '@/utils/formatDate';

export const LeadDetailPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { id = '' } = useParams<{ id: string }>();
  const { user } = useAuth();
  const leadQuery = useLead(id);
  const lead = leadQuery.data;

  const canEdit = Boolean(user && lead && (user.role === 'admin' || lead.createdBy === user.id));

  return (
    <Layout>
      {leadQuery.isLoading ? <LeadSkeleton /> : null}

      {!leadQuery.isLoading && !lead ? (
        <EmptyState
          title="Lead not found"
          description="The record may have been removed or the link is invalid."
          actionLabel="Back to dashboard"
          onAction={() => navigate('/dashboard')}
        />
      ) : null}

      {lead ? (
        <div className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-brand-300">Lead detail</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">{lead.name}</h2>
              <p className="mt-2 text-sm text-slate-400">Created {formatDate(lead.createdAt)}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {canEdit ? (
                <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                  Edit from dashboard
                </Button>
              ) : null}
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                Back
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Email</p>
              <p className="mt-2 text-lg font-medium text-white">{lead.email}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Status</p>
              <div className="mt-2">
                <Badge status={lead.status} />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Source</p>
              <p className="mt-2 text-lg font-medium text-white">{lead.source}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Created by</p>
              <p className="mt-2 text-lg font-medium text-white">{lead.createdBy}</p>
            </div>
          </div>
        </div>
      ) : null}
    </Layout>
  );
};
