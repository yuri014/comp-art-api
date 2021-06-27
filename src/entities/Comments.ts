import mongoose, { Schema } from 'mongoose';

import { Comment } from '../interfaces/Comment';

const CommentSchema = new Schema({
  post: { type: Schema.Types.ObjectId, refPath: 'onModel', required: true },
  onModel: { type: String, required: true, enum: ['Post', 'Share'] },
  comments: [
    {
      author: { type: Schema.Types.ObjectId, required: true, refPath: 'comments.onModel' },
      onModel: { type: String, required: true, enum: ['ArtistProfile', 'UserProfile'] },
      body: { type: String, required: true },
      createdAt: String,
    },
  ],
});

export default mongoose.model<Comment>('Comment', CommentSchema);
