import { Document } from 'mongoose';
import { IArtistProfile, IUserProfile } from './Profile';
import { IUpload } from './Upload';

interface Post {
  description?: string;
  mediaId: number;
}

export interface IPost extends Document, Post {
  _doc?: IPost;
  body: string;
  likes: Array<{
    profile: IArtistProfile | IUserProfile | string;
    onModel: string;
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
