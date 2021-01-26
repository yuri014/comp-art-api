import { Document } from 'mongoose';

type FollowProfile = [
  {
    avatar: string;
    owner: string;
  },
];

export interface IFollower extends Document {
  _doc: IFollower;
  username: string;
  userFollowers?: FollowProfile;
  artistFollowers?: FollowProfile;
}

export interface IFollowing extends Document {
  _doc: IFollowing;
  username: string;
  userFollowing?: FollowProfile;
  artistFollowing?: FollowProfile;
}
