import mongoose, { Schema } from 'mongoose';

import { Comment } from '../interfaces/Comment';

const CommentSchema = new Schema({
  post: { type: Schema.Types.ObjectId, refPath: 'onModel', required: true },
  onModel: { type: String, required: true, enum: ['Post', 'Share'] },
  likesCount: Number,
  comments: [
    {
      author: { type: Schema.Types.ObjectId, required: true, refPath: 'comments.onModel' },
      onModel: { type: String, required: true, enum: ['ArtistProfile', 'UserProfile'] },
      body: { type: String, required: true },
      createdAt: String,
      likes: [
        {
          author: { type: Schema.Types.ObjectId, refPath: 'comments.likes.onModel' },
          onModel: { type: String, required: true, enum: ['ArtistProfile', 'UserProfile'] },
        },
      ],
    },
  ],
});

export default mongoose.model<Comment>('Comment', CommentSchema);
