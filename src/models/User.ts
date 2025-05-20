import { Schema, model, Document } from 'mongoose';
import { Role } from '../types/enums';

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  fullName?: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [emailRegex, 'Please enter a valid email address'],
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    trim: true,
    lowercase: true,
  },
  fullName: {
    type: String,
    default: '',
    trim: true,
  },
  role: {
    type: String,
    enum: {
      values: Object.values(Role),
      message: '{VALUE} is not a valid role',
    },
    default: Role.VIEWER,
  },
}, {
  timestamps: true,
});


UserSchema.index({ email: 1, username: 1 });

export const User = model<IUser>('User', UserSchema);
