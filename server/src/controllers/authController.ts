import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User';
import { asyncWrapper } from '../utils/asyncWrapper';
import { AppError } from '../utils/errors';
import { sendSuccess } from '../utils/apiResponse';
import { signToken } from '../utils/jwt';
import { loginSchema, registerSchema } from '../validators/authValidators';
import type {
  AuthResponseData,
  LoginRequestBody,
  RegisterRequestBody
} from '../types/auth';
import type { ApiSuccessResponse } from '../types/api';
import type { IUser } from '../types/user';
import type { ParsedQs } from 'qs';

const toAuthUserDto = (user: IUser) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt.toISOString()
});

export const register = asyncWrapper<
  Record<string, never>,
  ApiSuccessResponse<AuthResponseData>,
  RegisterRequestBody,
  ParsedQs
>(
  async (
    req: Request<Record<string, never>, ApiSuccessResponse<AuthResponseData>, RegisterRequestBody, ParsedQs>,
    res: Response<ApiSuccessResponse<AuthResponseData>>
  ) => {
    const parsedBody = registerSchema.safeParse(req.body);

    if (!parsedBody.success) {
      throw new AppError(400, 'Validation failed', parsedBody.error.flatten());
    }

    const { name, email, password, role } = parsedBody.data;
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      throw new AppError(400, 'Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: role ?? 'sales'
    });
    const token = signToken({ userId: user._id.toString(), role: user.role });

    sendSuccess(res, 201, 'User registered successfully', {
      user: toAuthUserDto(user),
      token
    });
  }
);

export const login = asyncWrapper<
  Record<string, never>,
  ApiSuccessResponse<AuthResponseData>,
  LoginRequestBody,
  ParsedQs
>(
  async (
    req: Request<Record<string, never>, ApiSuccessResponse<AuthResponseData>, LoginRequestBody, ParsedQs>,
    res: Response<ApiSuccessResponse<AuthResponseData>>
  ) => {
    const parsedBody = loginSchema.safeParse(req.body);

    if (!parsedBody.success) {
      throw new AppError(400, 'Validation failed', parsedBody.error.flatten());
    }

    const { email, password } = parsedBody.data;
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw new AppError(401, 'Invalid email or password');
    }

    const token = signToken({ userId: user._id.toString(), role: user.role });

    sendSuccess(res, 200, 'Login successful', {
      user: toAuthUserDto(user),
      token
    });
  }
);
