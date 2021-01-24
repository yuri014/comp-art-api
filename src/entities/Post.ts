import mongoose, { Schema } from 'mongoose';

import { IPost } from '../interfaces/Post';

const PostSchema = new Schema({
  description: { type: String },
  body: { type: String, required: true },
  likes: [
    {
      username: String,
      avatar: String,
      createdAt: String,
    },
  ],
  sharedCount: { type: Number, default: 0 },
  createdAt: String,
  artist: {
    type: Schema.Types.String,
    ref: 'artistprofiles',
  },
});

export default mongoose.model<IPost>('Post', PostSchema);
