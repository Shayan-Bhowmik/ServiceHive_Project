import { Schema, model, type Model, type Types } from 'mongoose';
import type { IUser } from '../types/user';
import type { UserRole } from '../types/auth';

const UserSchema = new Schema<IUser, Model<IUser>>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'sales'] as UserRole[],
      default: 'sales'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

export const UserModel = model<IUser>('User', UserSchema);
export type UserId = Types.ObjectId;
