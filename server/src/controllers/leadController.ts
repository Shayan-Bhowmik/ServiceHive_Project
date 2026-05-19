import type { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import { LeadModel } from '../models/Lead';
import { asyncWrapper } from '../utils/asyncWrapper';
import { AppError } from '../utils/errors';
import { sendSuccess } from '../utils/apiResponse';
import { escapeRegex } from '../utils/regex';
import {
  createLeadSchema,
  leadListQuerySchema,
  updateLeadSchema
} from '../validators/leadValidators';
import type {
  CreateLeadRequestBody,
  LeadDocumentFields,
  LeadDto,
  LeadListResponse,
  UpdateLeadRequestBody
} from '../types/lead';
import type { ApiSuccessResponse } from '../types/api';
import type { ParsedQs } from 'qs';

const toLeadDto = (lead: LeadDocumentFields): LeadDto => ({
  id: lead._id.toString(),
  name: lead.name,
  email: lead.email,
  status: lead.status,
  source: lead.source,
  createdBy: lead.createdBy.toString(),
  createdAt: lead.createdAt.toISOString(),
  updatedAt: lead.updatedAt.toISOString()
});

const buildLeadQuery = (filters: ReturnType<typeof leadListQuerySchema.parse>): FilterQuery<LeadDocumentFields> => {
  const query: FilterQuery<LeadDocumentFields> = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.source) {
    query.source = filters.source;
  }

  if (filters.search) {
    const normalizedSearch = escapeRegex(filters.search.trim());
    query.$or = [
      { name: { $regex: normalizedSearch, $options: 'i' } },
      { email: { $regex: normalizedSearch, $options: 'i' } }
    ];
  }

  return query;
};

export const createLead = asyncWrapper<
  Record<string, never>,
  ApiSuccessResponse<LeadDto>,
  CreateLeadRequestBody,
  ParsedQs
>(
  async (
    req: Request<Record<string, never>, ApiSuccessResponse<LeadDto>, CreateLeadRequestBody, ParsedQs>,
    res: Response<ApiSuccessResponse<LeadDto>>
  ) => {
    const parsedBody = createLeadSchema.safeParse(req.body);

    if (!parsedBody.success) {
      throw new AppError(400, 'Validation failed', parsedBody.error.flatten());
    }

    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError(401, 'Authentication required');
    }

    const lead = await LeadModel.create({
      ...parsedBody.data,
      createdBy: userId
    });

    sendSuccess(res, 201, 'Lead created successfully', toLeadDto(lead));
  }
);

export const getLeads = asyncWrapper<
  Record<string, never>,
  ApiSuccessResponse<LeadListResponse>,
  unknown,
  ParsedQs
>(
  async (
    req: Request<Record<string, never>, ApiSuccessResponse<LeadListResponse>, unknown, ParsedQs>,
    res: Response<ApiSuccessResponse<LeadListResponse>>
  ) => {
    const parsedQuery = leadListQuerySchema.safeParse(req.query);

    if (!parsedQuery.success) {
      throw new AppError(400, 'Validation failed', parsedQuery.error.flatten());
    }

    const page = parsedQuery.data.page ?? 1;
    const limit = parsedQuery.data.limit ?? 10;
    const sortOrder = parsedQuery.data.sort === 'oldest' ? 1 : -1;
    const query = buildLeadQuery(parsedQuery.data);

    const total = await LeadModel.countDocuments(query);
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
    const leads = await LeadModel.find(query)
      .sort({ createdAt: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    sendSuccess(res, 200, 'Leads fetched successfully', {
      data: leads.map((lead) => toLeadDto(lead)),
      total,
      page,
      totalPages,
      limit
    });
  }
);

export const getLeadById = asyncWrapper<
  { id: string },
  ApiSuccessResponse<LeadDto>,
  unknown,
  ParsedQs
>(
  async (
    req: Request<{ id: string }, ApiSuccessResponse<LeadDto>, unknown, ParsedQs>,
    res: Response<ApiSuccessResponse<LeadDto>>
  ) => {
    const { id } = req.params;
    const lead = await LeadModel.findById(id);

    if (!lead) {
      throw new AppError(404, 'Lead not found');
    }

    sendSuccess(res, 200, 'Lead fetched successfully', toLeadDto(lead));
  }
);

export const updateLead = asyncWrapper<
  { id: string },
  ApiSuccessResponse<LeadDto>,
  UpdateLeadRequestBody,
  ParsedQs
>(
  async (
    req: Request<{ id: string }, ApiSuccessResponse<LeadDto>, UpdateLeadRequestBody, ParsedQs>,
    res: Response<ApiSuccessResponse<LeadDto>>
  ) => {
    const parsedBody = updateLeadSchema.safeParse(req.body);

    if (!parsedBody.success) {
      throw new AppError(400, 'Validation failed', parsedBody.error.flatten());
    }

    const { id } = req.params;
    const lead = await LeadModel.findById(id);

    if (!lead) {
      throw new AppError(404, 'Lead not found');
    }

    const currentUser = req.user;

    if (!currentUser) {
      throw new AppError(401, 'Authentication required');
    }

    const isOwner = lead.createdBy.toString() === currentUser.userId;

    if (currentUser.role !== 'admin' && !isOwner) {
      throw new AppError(403, 'Only the lead owner or an admin can update this lead');
    }

    Object.assign(lead, parsedBody.data);
    await lead.save();

    sendSuccess(res, 200, 'Lead updated successfully', toLeadDto(lead));
  }
);

export const deleteLead = asyncWrapper<
  { id: string },
  ApiSuccessResponse<{ id: string }>,
  unknown,
  ParsedQs
>(
  async (
    req: Request<{ id: string }, ApiSuccessResponse<{ id: string }>, unknown, ParsedQs>,
    res: Response<ApiSuccessResponse<{ id: string }>>
  ) => {
    const { id } = req.params;
    const lead = await LeadModel.findByIdAndDelete(id);

    if (!lead) {
      throw new AppError(404, 'Lead not found');
    }

    sendSuccess(res, 200, 'Lead deleted successfully', { id: lead._id.toString() });
  }
);
