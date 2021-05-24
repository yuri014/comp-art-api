import { Document } from 'mongoose';
import { IUser } from './User';

interface INotification extends Document {
  user: string | IUser;
  notifications: Array<{
    _id: string;
    from: string;
    body: string;
    read: boolean;
    createdAt: string;
    link: string;
    avatar: string;
  }>;
}

export default INotification;
