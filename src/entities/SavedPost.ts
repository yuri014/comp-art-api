import { model, Schema } from 'mongoose';

import ISavedPost from '../interfaces/SavedPost';

const SavedPost = new Schema({
  profile: { type: Schema.Types.ObjectId, refPath: 'onModel', required: true },
  onModel: { type: String, enum: ['ArtistProfile', 'UserProfile'], required: true },
  posts: [
    {
      post: { type: Schema.Types.ObjectId, refPath: 'posts.onModel', required: true },
      onModel: { type: String, enum: ['Share', 'Post'], required: true },
    },
  ],
});

export default model<ISavedPost>('SavedPost', SavedPost);
