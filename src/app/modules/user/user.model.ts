import { model, Schema } from 'mongoose';
import { IUser, UserModel } from './user.interface';

const userSchema = new Schema<IUser>(
  {
    id: { type: String, required: true },
    role: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export const User = model<IUser, UserModel>('User', userSchema);
