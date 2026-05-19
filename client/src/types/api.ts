export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  total?: number;
  page?: number;
  totalPages?: number;
  limit?: number;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: unknown;
}
