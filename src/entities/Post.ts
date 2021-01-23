import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {}

const PostSchema = new Schema({
  description: { type: String, required: true },
  media: { type: String, required: true },
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
    type: Schema.Types.ObjectId,
    ref: 'artistprofiles',
  },
});

export default mongoose.model<IPost>('Post', PostSchema);
