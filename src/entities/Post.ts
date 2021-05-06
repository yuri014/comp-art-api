import mongoose, { Schema } from 'mongoose';

import { IPost } from '@interfaces/Post';

/**
 * @field
 * mediaId:
 * 1 - image
 * 2 - audio
 * 3 - video
 * 4 - text
 */

const PostSchema = new Schema({
  description: { type: String },
  body: { type: String, required: true },
  mediaId: { type: Number, required: true, default: 1 },
  likes: [
    {
      profile: { type: Schema.Types.ObjectId, refPath: 'likes.onModel' },
      onModel: { type: String, enum: ['ArtistProfile', 'UserProfile'] },
    },
  ],
  likesCount: { type: Number, default: 0 },
  sharedCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  alt: String,
  darkColor: String,
  lightColor: String,
  createdAt: String,
  thumbnail: String,
  artist: {
    type: Schema.Types.ObjectId,
    ref: 'ArtistProfile',
  },
});

PostSchema.index({ description: 'text', body: 'text', alt: 'text' });

export default mongoose.model<IPost>('Post', PostSchema);
