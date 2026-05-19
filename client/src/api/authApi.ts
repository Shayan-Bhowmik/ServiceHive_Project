import { apiClient } from './httpClient';
import type {
  AuthResponseData,
  LoginRequestBody,
  RegisterRequestBody
} from '@/types/auth';
import type { ApiSuccessResponse } from '@/types/api';

export const registerUser = async (
  payload: RegisterRequestBody
): Promise<AuthResponseData> => {
  const response = await apiClient.post<ApiSuccessResponse<AuthResponseData>>('/auth/register', payload);
  return response.data.data;
};

export const loginUser = async (payload: LoginRequestBody): Promise<AuthResponseData> => {
  const response = await apiClient.post<ApiSuccessResponse<AuthResponseData>>('/auth/login', payload);
  return response.data.data;
};
