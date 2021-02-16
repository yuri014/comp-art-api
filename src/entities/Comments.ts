import mongoose, { Schema } from 'mongoose';

import { Comment } from '../interfaces/Comment';

const CommentSchema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  comments: [
    {
      author: { type: Schema.Types.ObjectId, required: true, refPath: 'onModel' },
      onModel: { type: String, required: true, enum: ['ArtistProfile', 'UserProfile'] },
      body: { type: String, required: true },
      createdAt: String,
    },
  ],
});

export default mongoose.model<Comment>('Comment', CommentSchema);
