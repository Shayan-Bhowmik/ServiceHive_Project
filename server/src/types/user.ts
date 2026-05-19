import type { Types } from 'mongoose';
import type { UserRole } from './auth';

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
}
