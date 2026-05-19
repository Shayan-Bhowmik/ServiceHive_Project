import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { LeadFilters } from '@/components/leads/LeadFilters';
import { LeadForm } from '@/components/leads/LeadForm';
import { LeadSkeleton } from '@/components/leads/LeadSkeleton';
import { LeadTable } from '@/components/leads/LeadTable';
import { ConfirmModal } from '@/components/leads/ConfirmModal';
import { Layout } from '@/components/layout/Layout';
import { csvExport } from '@/utils/csvExport';
import { useAuth } from '@/hooks/useAuth';
import { useDebounce } from '@/hooks/useDebounce';
import {
  useCreateLead,
  useDeleteLead,
  useLeads,
  useUpdateLead
} from '@/hooks/useLeads';
import type { Lead, LeadFormValues, LeadFiltersState } from '@/types/lead';
import { fetchLeads } from '@/api/leadsApi';
import { formatDate } from '@/utils/formatDate';
import { useNavigate } from 'react-router-dom';

const defaultFormValues: LeadFormValues = {
  name: '',
  email: '',
  status: 'New',
  source: 'Website'
};

const buildPageNumbers = (page: number, totalPages: number): number[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const startPage = Math.max(1, page - 2);
  const endPage = Math.min(totalPages, startPage + 4);
  const adjustedStart = Math.max(1, endPage - 4);
  return Array.from({ length: endPage - adjustedStart + 1 }, (_, index) => adjustedStart + index);
};

export const DashboardPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const createLeadMutation = useCreateLead();
  const updateLeadMutation = useUpdateLead();
  const deleteLeadMutation = useDeleteLead();

  const [filters, setFilters] = useState<LeadFiltersState>({
    page: 1,
    limit: 10,
    status: '',
    source: '',
    search: '',
    sort: 'latest'
  });
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 500);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  useEffect(() => {
    setFilters((current) => ({ ...current, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch]);

  const leadsQuery = useLeads(filters);
  const leads = leadsQuery.data?.data ?? [];
  const totalPages = leadsQuery.data?.totalPages ?? 0;
  const totalLeads = leadsQuery.data?.total ?? 0;
  const pageNumbers = useMemo(() => buildPageNumbers(filters.page, totalPages), [filters.page, totalPages]);

  const canEditLead = (lead: Lead): boolean => {
    if (!user) {
      return false;
    }

    return user.role === 'admin' || lead.createdBy === user.id;
  };

  const canDeleteLead = (): boolean => {
    return user?.role === 'admin';
  };

  const handleFilterChange = <K extends keyof LeadFiltersState>(field: K, value: LeadFiltersState[K]): void => {
    if (field === 'page') {
      setFilters((current) => ({
        ...current,
        page: value as number
      }));
      return;
    }

    setFilters((current) => ({
      ...current,
      [field]: value,
      page: 1
    }));
  };

  const openCreateModal = (): void => {
    setSelectedLead(null);
    setIsFormOpen(true);
  };

  const openEditModal = (lead: Lead): void => {
    setSelectedLead(lead);
    setIsFormOpen(true);
  };

  const closeFormModal = (): void => {
    setSelectedLead(null);
    setIsFormOpen(false);
  };

  const closeDeleteModal = (): void => {
    setLeadToDelete(null);
  };

  const handleSubmitLead = async (values: LeadFormValues): Promise<void> => {
    if (selectedLead) {
      await updateLeadMutation.mutateAsync({ leadId: selectedLead.id, payload: values });
    } else {
      await createLeadMutation.mutateAsync(values);
    }
    closeFormModal();
  };

  const handleExportCsv = async (): Promise<void> => {
    if (totalLeads === 0) {
      return;
    }

    const allLeads = await queryClient.fetchQuery({
      queryKey: ['leads-export', filters],
      queryFn: () =>
        fetchLeads({
          ...filters,
          page: 1,
          limit: totalLeads
        })
    });

    csvExport(
      allLeads.data.map((lead) => ({
        Name: lead.name,
        Email: lead.email,
        Status: lead.status,
        Source: lead.source,
        'Created At': formatDate(lead.createdAt)
      })),
      'smart-leads-export'
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-brand-300">Pipeline overview</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Leads dashboard</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                Search, filter, export, and manage leads from a single control center.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={handleExportCsv} disabled={totalLeads === 0}>
                Export CSV
              </Button>
              <Button onClick={openCreateModal}>Add Lead</Button>
            </div>
          </div>
          <div className="mt-6">
            <LeadFilters
              filters={filters}
              onChange={(field, value) => {
                if (field === 'search') {
                  setSearchInput(String(value));
                  return;
                }

                handleFilterChange(field, value);
              }}
            />
          </div>
        </section>

        {leadsQuery.isLoading ? <LeadSkeleton /> : null}

        {!leadsQuery.isLoading && leads.length === 0 ? (
          <EmptyState
            title="No leads found"
            description="Try adjusting the status, source, or search filters to see more results."
            actionLabel="Add your first lead"
            onAction={openCreateModal}
          />
        ) : null}

        {!leadsQuery.isLoading && leads.length > 0 ? (
          <LeadTable
            leads={leads}
            canEditLead={canEditLead}
            canDeleteLead={canDeleteLead}
            onEdit={openEditModal}
            onDelete={(lead) => setLeadToDelete(lead)}
            onView={(lead) => navigate(`/leads/${lead.id}`)}
          />
        ) : null}

        {totalPages > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-4">
            <p className="text-sm text-slate-300">
              Page {filters.page} of {totalPages} · {totalLeads} total leads
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={filters.page === 1}
                onClick={() => handleFilterChange('page', filters.page - 1)}
              >
                Prev
              </Button>
              {pageNumbers.map((pageNumber) => (
                <Button
                  key={pageNumber}
                  variant={pageNumber === filters.page ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => handleFilterChange('page', pageNumber)}
                >
                  {pageNumber}
                </Button>
              ))}
              <Button
                variant="secondary"
                size="sm"
                disabled={filters.page >= totalPages}
                onClick={() => handleFilterChange('page', filters.page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      <Modal
        open={isFormOpen}
        title={selectedLead ? 'Edit Lead' : 'Add Lead'}
        onClose={closeFormModal}
      >
        <LeadForm
          initialValues={
            selectedLead
              ? {
                  name: selectedLead.name,
                  email: selectedLead.email,
                  status: selectedLead.status,
                  source: selectedLead.source
                }
              : defaultFormValues
          }
          onSubmit={handleSubmitLead}
          submitting={createLeadMutation.isPending || updateLeadMutation.isPending}
          submitLabel={selectedLead ? 'Update lead' : 'Create lead'}
        />
      </Modal>

      <ConfirmModal
        open={leadToDelete !== null}
        title="Delete lead"
        description={
          leadToDelete
            ? `Are you sure you want to permanently delete ${leadToDelete.name}? This cannot be undone.`
            : ''
        }
        confirmLabel={deleteLeadMutation.isPending ? 'Deleting...' : 'Delete lead'}
        destructive
        onCancel={closeDeleteModal}
        onConfirm={async () => {
          if (!leadToDelete) {
            return;
          }

          await deleteLeadMutation.mutateAsync(leadToDelete.id);
          closeDeleteModal();
        }}
      />
    </Layout>
  );
};
