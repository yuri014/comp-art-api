import { Document } from 'mongoose';
import { IUser } from './User';

interface INotification extends Document {
  user: string | IUser;
  notifications: Array<{
    _id: string;
    title: string;
    body: string;
    read: boolean;
    createdAt: string;
    link: string;
  }>;
}

export default INotification;
