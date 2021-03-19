import { model, Schema } from 'mongoose';
import { IFollowing } from '../interfaces/Follow';

const FollowingSchema = new Schema({
  username: {
    type: Schema.Types.String,
    ref: 'User',
    required: true,
  },
  userFollowing: [
    {
      type: Schema.Types.ObjectId,
      ref: 'UserProfile',
    },
  ],
  artistFollowing: [
    {
      type: Schema.Types.ObjectId,
      ref: 'ArtistProfile',
    },
  ],
});

export default model<IFollowing>('Following', FollowingSchema);
