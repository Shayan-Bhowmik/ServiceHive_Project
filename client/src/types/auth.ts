export type UserRole = 'admin' | 'sales';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthResponseData {
  user: AuthUser;
  token: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}
