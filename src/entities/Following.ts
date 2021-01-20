import { model, Schema } from 'mongoose';
import { Following } from '../interfaces/Follow';

const FollowingSchema = new Schema({
  username: {
    type: Schema.Types.String,
    ref: 'users',
    required: true,
  },
  userFollowing: {
    type: [Schema.Types.String],
    ref: 'userprofiles',
  },
  artistFollowing: {
    type: [Schema.Types.String],
    ref: 'artistprofiles',
  },
});

export default model<Following>('Following', FollowingSchema);
