import { model, Schema } from 'mongoose';
import { IUserProfile } from '../interfaces/Profile';

const UserProfileSchema = new Schema({
  name: { type: String, required: true },
  avatar: String,
  coverImage: String,
  bio: String,
  sharedPostCount: { type: Number, default: 0 },
  followers: { type: Number, default: 0 },
  following: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  createdAt: String,
  updatedAt: String,
  owner: {
    type: Schema.Types.String,
    ref: 'users',
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
});

export default model<IUserProfile>('UserProfile', UserProfileSchema);
