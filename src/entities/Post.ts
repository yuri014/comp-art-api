import mongoose, { Schema } from 'mongoose';

import { IPost } from '../interfaces/Post';

const PostSchema = new Schema({
  description: { type: String },
  body: { type: String, required: true },
  isAudio: { type: Boolean, required: true, default: false },
  likes: [
    {
      username: String,
      avatar: String,
      createdAt: String,
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
