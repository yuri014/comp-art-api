import { model, Schema } from 'mongoose';

import { IArtistProfile } from '../interfaces/Profile';

const ArtistProfileSchema = new Schema({
  name: { type: String, required: true },
  avatar: String,
  coverImage: String,
  bio: String,
  postCount: { type: Number, default: 0, min: 0 },
  followers: { type: Number, default: 0, min: 0 },
  following: { type: Number, default: 0, min: 0 },
  xp: { type: Number, default: 0, min: 0 },
  level: { type: Number, default: 1, min: 1 },
  isBlockedToPost: { type: Boolean, default: false },
  postsRemainingToUnblock: { type: Number, default: 0, min: 0, max: 3 },
  createdAt: String,
  updatedAt: String,
  owner: {
    type: Schema.Types.String,
    ref: 'User',
  },
  hashtags: { type: [String], maxlength: 6 },
  links: {
    soundcloud: String,
    twitter: String,
    facebook: String,
    wattpad: String,
    pinterest: String,
    bandcamp: String,
    deviantart: String,
    customLink: String,
  },
  phone: { type: String },
  pix: { city: String, message: String, key: String },
});

ArtistProfileSchema.index({ name: 'text', owner: 'text' });

export default model<IArtistProfile>('ArtistProfile', ArtistProfileSchema);
