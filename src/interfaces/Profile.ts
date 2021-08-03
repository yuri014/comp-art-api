import { Document } from 'mongoose';
import { IUpload } from './Upload';

export interface IProfile {
  name: string;
  bio: string;
  avatar: string;
  coverImage: string;
  followers: number;
  following: number;
  xp: number;
  level: number;
  createdAt: string;
  updatedAt: string;
  owner: string;
}

interface HashtagsAndLinks {
  hashtags: Array<string>;
  links: {
    soundcloud: string;
    twitter: string;
    facebook: string;
    wattpad: string;
    pinterest: string;
    deviantart: string;
    bandcamp: string;
    customLink: string;
  };
}

export interface IUserProfile extends Document, IProfile, HashtagsAndLinks {
  _doc?: IUserProfile;
  sharedPostCount: number;
}

export interface IPixInput {
  city: string;
  message: string;
  key: string;
}

export interface IArtistProfile extends Document, IProfile, HashtagsAndLinks {
  _doc?: IArtistProfile;
  postCount: number;
  isBlockedToPost: boolean;
  postsRemainingToUnblock: number;
  phone: string;
  pix: IPixInput;
}

export interface ICreateProfile extends HashtagsAndLinks {
  name: string;
  avatar: Promise<IUpload>;
  coverImage: Promise<IUpload>;
  bio: string;
}
