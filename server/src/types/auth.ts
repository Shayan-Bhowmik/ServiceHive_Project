export type UserRole = 'admin' | 'sales';

export interface JWTPayload {
  userId: string;
  role: UserRole;
}

export interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface AuthUserDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthResponseData {
  user: AuthUserDto;
  token: string;
}
