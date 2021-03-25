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
  likesCount: number;
  sharedCount: number;
  commentsCount: number;
  createdAt: string;
  artist: string | IArtistProfile;
}

export interface IPostInput extends Post {
  body: Promise<IUpload>;
}
