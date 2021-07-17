import { Document } from 'mongoose';

interface User {
  username: string;
  email: string;
  password: string;
  isArtist: boolean;
}

export interface IUser extends Document, User {
  _doc?: IUser;
  _id: string;
  confirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
  blockUntil: Date | '';
  strikes: number;
}

export interface IRegisterFields extends User {
  confirmPassword: string;
}
