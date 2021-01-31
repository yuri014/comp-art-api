import { Document } from 'mongoose';

export type FollowProfile = {
  avatar: string;
  owner: string;
  name: string;
};

export interface IFollower extends Document {
  _doc?: IFollower;
  username: string;
  userFollowers?: FollowProfile;
  artistFollowers?: FollowProfile;
}

export interface IFollowing extends Document {
  _doc?: IFollowing;
  username: string;
  userFollowing?: FollowProfile;
  artistFollowing?: FollowProfile;
}
