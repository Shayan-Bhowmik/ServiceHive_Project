import type { UserRole } from './auth';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';
export type LeadSort = 'latest' | 'oldest';

export interface Lead {
  id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadListResponse {
  data: Lead[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface LeadQueryParams {
  page: number;
  limit: number;
  status: '' | LeadStatus;
  source: '' | LeadSource;
  search: string;
  sort: LeadSort;
}

export type LeadFiltersState = LeadQueryParams;

export interface LeadFormValues {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

export interface LeadFormErrors {
  name?: string;
  email?: string;
  status?: string;
  source?: string;
}

export interface LeadActionPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canCreate: boolean;
  role: UserRole;
}
