import { Schema, model, type Model } from 'mongoose';
import type { LeadDocumentFields } from '../types/lead';

const LeadSchema = new Schema<LeadDocumentFields, Model<LeadDocumentFields>>(
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
      lowercase: true
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Lost'],
      required: true,
      default: 'New'
    },
    source: {
      type: String,
      enum: ['Website', 'Instagram', 'Referral'],
      required: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const LeadModel = model<LeadDocumentFields>('Lead', LeadSchema);
