import { model, Schema } from 'mongoose';
import { IFollower } from '@interfaces/Follow';

const FollowerSchema = new Schema({
  username: {
    type: Schema.Types.String,
    ref: 'User',
    required: true,
  },
  userFollowers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'UserProfile',
    },
  ],
  artistFollowers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'ArtistProfile',
    },
  ],
});

export default model<IFollower>('Follower', FollowerSchema);
