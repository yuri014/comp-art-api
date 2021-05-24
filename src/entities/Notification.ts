import { model, Schema } from 'mongoose';
import INotification from '../interfaces/Notification';

const NotificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, path: 'User', required: true },
  notifications: [
    {
      _id: { type: Schema.Types.ObjectId, auto: true },
      title: String,
      body: String,
      read: { type: Boolean, default: false },
      createdAt: String,
      link: String,
    },
  ],
});

export default model<INotification>('Notification', NotificationSchema);
