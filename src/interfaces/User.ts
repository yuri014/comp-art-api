import { Document } from 'mongoose';

export interface IUser extends Document {
  _doc: IUser;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface IRegisterFields {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
