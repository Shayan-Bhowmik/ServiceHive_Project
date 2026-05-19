import type { Types } from 'mongoose';
import type { UserRole } from './auth';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export interface LeadQueryParams {
  page?: number;
  limit?: number;
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: 'latest' | 'oldest';
}

export interface CreateLeadRequestBody {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

export interface UpdateLeadRequestBody {
  name?: string;
  email?: string;
  status?: LeadStatus;
  source?: LeadSource;
}

export interface LeadDto {
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
  data: LeadDto[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface LeadDocumentFields {
  _id: Types.ObjectId;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeadFiltersState {
  page: number;
  limit: number;
  status: '' | LeadStatus;
  source: '' | LeadSource;
  search: string;
  sort: 'latest' | 'oldest';
}

export interface LeadFormValues {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

export interface LeadOwnerSummary {
  id: string;
  role: UserRole;
}
