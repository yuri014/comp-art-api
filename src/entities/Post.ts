import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {}

const PostSchema = new Schema({
  description: String,
  media: { type: [String], maxlength: 4 },
  createdAt: String,
  comments: [
    {
      username: String,
      comment: String,
      createdAt: String,
    },
  ],
  likes: [
    {
      username: String,
      createdAt: String,
    },
  ],
  sharedCount: { type: Number, default: 0 },
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'artistprofiles',
  },
});

export default mongoose.model<IPost>('Post', PostSchema);
