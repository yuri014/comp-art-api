import { Document } from 'mongoose';
import { IArtistProfile, IUserProfile } from './Profile';

export interface IFollower extends Document {
  _doc?: IFollower;
  username: string;
  userFollowers: IUserProfile[];
  artistFollowers: IArtistProfile[];
}

export interface IFollowing extends Document {
  _doc?: IFollowing;
  username: string;
  userFollowing: IUserProfile[];
  artistFollowing: IArtistProfile[];
}
