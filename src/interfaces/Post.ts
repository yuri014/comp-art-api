import { Document } from 'mongoose';

import { IUpload } from './Upload';
import { IOnModel } from './General';
import { IArtistProfile, IUserProfile } from './Profile';

interface Post {
  description?: string;
  mediaId: number;
  alt?: string;
}

export interface IPost extends Document, Post {
  _doc?: IPost;
  body: string;
  likes: Array<{
    profile: IArtistProfile | IUserProfile | string;
    onModel: IOnModel;
  }>;
  artist: string | IArtistProfile;
  color: string;
  thumbnail: string;
  likesCount: number;
  sharedCount: number;
  commentsCount: number;
  createdAt: string;
}

export interface IPostInput extends Post {
  body: Promise<IUpload>;
}

export interface IPostAudio extends IPostInput {
  thumbnail?: Promise<IUpload>;
}
