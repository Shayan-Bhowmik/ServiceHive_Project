import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createLead,
  deleteLead,
  fetchLeadById,
  fetchLeads,
  updateLead
} from '@/api/leadsApi';
import type { LeadFormValues, LeadQueryParams } from '@/types/lead';

const leadQueryKey = 'leads';

export const useLeads = (params: LeadQueryParams) => {
  return useQuery({
    queryKey: [leadQueryKey, params],
    queryFn: () => fetchLeads(params),
    staleTime: 30_000
  });
};

export const useLead = (leadId: string) => {
  return useQuery({
    queryKey: [leadQueryKey, leadId],
    queryFn: () => fetchLeadById(leadId),
    enabled: leadId.length > 0
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LeadFormValues) => createLead(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [leadQueryKey] });
    }
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, payload }: { leadId: string; payload: LeadFormValues }) =>
      updateLead(leadId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [leadQueryKey] });
    }
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (leadId: string) => deleteLead(leadId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [leadQueryKey] });
    }
  });
};
