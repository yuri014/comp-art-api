import { Document } from 'mongoose';

export interface IUser extends Document {
  _doc: IUser;
  username: string;
  email: string;
  password: string;
  confirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IRegisterFields {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
