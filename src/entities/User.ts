import { model, Schema } from 'mongoose';

import { IUser } from '../interfaces/User';

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmed: { type: Boolean, default: false },
  isArtist: { type: Boolean, required: true },
  strikes: { type: Number, default: 0 },
  createdAt: String,
  updatedAt: String,
  blockUntil: String,
});

export default model<IUser>('User', UserSchema);
