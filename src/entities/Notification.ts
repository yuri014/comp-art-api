import { model, Schema } from 'mongoose';

const NotificationSchema = new Schema({
  profile: { type: Schema.Types.ObjectId, refPath: 'onModel', required: true },
  onModel: { type: String, required: true, enum: ['ArtistProfile', 'UserProfile'] },
  notifications: [
    {
      title: String,
      body: String,
      read: Boolean,
      send: Boolean,
    },
  ],
});

export default model('Notification', NotificationSchema);
