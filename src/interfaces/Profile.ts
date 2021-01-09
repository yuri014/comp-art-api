import { Document } from 'mongoose';

export interface IUserProfile extends Document {
  _doc: IUserProfile;
  name: string;
  avatar: string;
  coverImage: string;
  bio: string;
  sharedPostCount: number;
  followers: number;
  following: number;
  createdAt: string;
  updatedAt: string;
  owner: string;
}

export interface IArtistProfile extends Document {
  _doc: IArtistProfile;
  name: string;
  avatar: string;
  coverImage: string;
  bio: string;
  postCount: number;
  followers: number;
  following: number;
  isBlockedToPost: boolean;
  postsRemainingToUnblock: number;
  createdAt: string;
  updatedAt: string;
  owner: string;
}

export interface ICreateProfile {
  name: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  token: string;
}
