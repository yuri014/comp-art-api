import { model, Schema } from 'mongoose';
import { IFollowing } from '../interfaces/Follow';

const FollowingSchema = new Schema({
  username: {
    type: Schema.Types.String,
    ref: 'users',
    required: true,
  },
  userFollowing: [
    {
      avatar: String,
      owner: String,
      name: String,
    },
  ],
  artistFollowing: [
    {
      avatar: String,
      owner: String,
      name: String,
    },
  ],
});

export default model<IFollowing>('Following', FollowingSchema);
