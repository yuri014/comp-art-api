import mongoose, { Schema } from 'mongoose';

import { Comment } from '../interfaces/Comment';

const CommentSchema = new Schema({
  on: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  comments: [
    {
      author: { type: Schema.Types.ObjectId, required: true, refPath: 'onModel' },
      onModel: { type: String, required: true, enum: ['ArtistProfile', 'UserProfile'] },
      body: String,
      createdAt: String,
    },
  ],
});

export default mongoose.model<Comment>('Comment', CommentSchema);
