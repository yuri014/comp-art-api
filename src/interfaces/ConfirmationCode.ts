import { Document } from 'mongoose';
import { IUser } from './User';

interface IConfirmationCode extends Document {
  user: string | IUser;
  code: number;
}

export default IConfirmationCode;
