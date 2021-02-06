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
  createdAt: String,
  artist: {
    name: { type: String, required: true },
    username: { type: String, required: true },
  },
});

export default mongoose.model<IPost>('Post', PostSchema);
