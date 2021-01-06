import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {}

const PostSchema = new Schema({
  description: String,
  img: {
    data: Buffer,
    contentType: String,
  },
  createdAt: String,
  name: String,
  username: String,
  comments: [
    {
      owner: { type: Schema.Types.ObjectId, required: true },
      name: String,
      comment: String,
      createdAt: String,
      updatedAt: String,
    },
  ],
  likes: [
    {
      owner: { type: Schema.Types.ObjectId, required: true },
      name: String,
      createdAt: String,
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
});

export default mongoose.model<IPost>('Post', PostSchema);
