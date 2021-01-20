import { model, Schema } from 'mongoose';
import { Followers } from '../interfaces/Follow';

const FollowersSchema = new Schema({
  username: {
    type: Schema.Types.String,
    ref: 'users',
    required: true,
  },
  userFollowers: {
    type: [Schema.Types.ObjectId],
    ref: 'userprofiles',
  },
  artistFollowers: {
    type: [Schema.Types.ObjectId],
    ref: 'artistprofiles',
  },
});

export default model<Followers>('Followers', FollowersSchema);
