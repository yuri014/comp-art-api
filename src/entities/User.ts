import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _doc: IUser;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: String,
  updatedAt: String,
});

export default mongoose.model<IUser>('User', UserSchema);
