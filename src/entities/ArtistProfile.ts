import { model, Schema } from 'mongoose';

import { IArtistProfile } from '../interfaces/Profile';

const ArtistProfileSchema = new Schema({
  name: { type: String, required: true },
  avatar: String,
  coverImage: String,
  bio: String,
  postCount: { type: Number, default: 0 },
  followers: { type: Number, default: 0 },
  following: { type: Number, default: 0 },
  isBlockedToPost: { type: Boolean, default: false },
  postsRemainingToUnblock: { type: Number, default: 0 },
  createdAt: String,
  updatedAt: String,
});

export default model<IArtistProfile>('ArtistProfile', ArtistProfileSchema);
