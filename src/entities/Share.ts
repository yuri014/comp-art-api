import mongoose, { Schema } from 'mongoose';
import { IShare } from '../interfaces/Share';

const ShareSchema = new Schema({
  description: { type: String },
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
  likes: [
    {
      profile: { type: Schema.Types.ObjectId, refPath: 'likes.onModel' },
      onModel: { type: String, enum: ['ArtistProfile', 'UserProfile'] },
    },
  ],
  likesCount: { type: Number, default: 0 },
  sharedCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  createdAt: String,
  profile: { type: Schema.Types.ObjectId, refPath: 'likes.onModel' },
  onModel: { type: String, enum: ['ArtistProfile', 'UserProfile'] },
});

export default mongoose.model<IShare>('Share', ShareSchema);
