import type { ApiSuccessResponse } from '@/types/api';
import type {
  Lead,
  LeadFormValues,
  LeadListResponse,
  LeadQueryParams
} from '@/types/lead';
import { apiClient } from './httpClient';

const buildQueryString = (params: Partial<LeadQueryParams>): string => {
  const query = new URLSearchParams();

  if (params.page !== undefined) {
    query.set('page', String(params.page));
  }

  if (params.limit !== undefined) {
    query.set('limit', String(params.limit));
  }

  if (params.status) {
    query.set('status', params.status);
  }

  if (params.source) {
    query.set('source', params.source);
  }

  if (params.search) {
    query.set('search', params.search);
  }

  if (params.sort) {
    query.set('sort', params.sort);
  }

  const serializedQuery = query.toString();
  return serializedQuery.length > 0 ? `?${serializedQuery}` : '';
};

export const fetchLeads = async (params: LeadQueryParams): Promise<LeadListResponse> => {
  const response = await apiClient.get<ApiSuccessResponse<LeadListResponse>>(
    `/leads${buildQueryString(params)}`
  );
  return response.data.data;
};

export const fetchLeadById = async (leadId: string): Promise<Lead> => {
  const response = await apiClient.get<ApiSuccessResponse<Lead>>(`/leads/${leadId}`);
  return response.data.data;
};

export const createLead = async (payload: LeadFormValues): Promise<Lead> => {
  const response = await apiClient.post<ApiSuccessResponse<Lead>>('/leads', payload);
  return response.data.data;
};

export const updateLead = async (leadId: string, payload: LeadFormValues): Promise<Lead> => {
  const response = await apiClient.put<ApiSuccessResponse<Lead>>(`/leads/${leadId}`, payload);
  return response.data.data;
};

export const deleteLead = async (leadId: string): Promise<string> => {
  const response = await apiClient.delete<ApiSuccessResponse<{ id: string }>>(`/leads/${leadId}`);
  return response.data.data.id;
};
