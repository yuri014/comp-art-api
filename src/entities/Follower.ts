import { model, Schema } from 'mongoose';
import { IFollower } from '../interfaces/Follow';

const FollowerSchema = new Schema({
  username: {
    type: Schema.Types.String,
    ref: 'users',
    required: true,
  },
  userFollowers: [
    {
      avatar: String,
      owner: String,
      name: String,
    },
  ],
  artistFollowers: [
    {
      avatar: String,
      owner: String,
      name: String,
    },
  ],
});

export default model<IFollower>('Follower', FollowerSchema);
