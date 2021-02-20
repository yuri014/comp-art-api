import mongoose, { Schema } from 'mongoose';

import { IPost } from '../interfaces/Post';

const PostSchema = new Schema({
  description: { type: String },
  body: { type: String, required: true },
  isAudio: { type: Boolean, required: true, default: false },
  likes: [
    {
      profile: { type: Schema.Types.ObjectId, refPath: 'likes.onModel' },
      onModel: { type: String, enum: ['ArtistProfile', 'UserProfile'] },
    },
  ],
  likesCount: { type: Number, default: 0 },
  sharedCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  avatar: { type: String },
  createdAt: String,
  artist: {
    type: Schema.Types.ObjectId,
    ref: 'ArtistProfile',
  },
});

export default mongoose.model<IPost>('Post', PostSchema);
