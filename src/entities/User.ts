import mongoose, { Schema } from 'mongoose';

import { IUser } from '../interfaces/User';

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmed: { type: Boolean, default: false },
  createdAt: String,
  updatedAt: String,
});

export default mongoose.model<IUser>('User', UserSchema);
