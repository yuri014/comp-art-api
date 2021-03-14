import { Document } from 'mongoose';
import { IArtistProfile, IUserProfile } from './Profile';
import { IUpload } from './Upload';

export interface IPostInput {
  description: string;
  body: Promise<IUpload>;
  mediaId: number;
}

export interface IPost extends Document {
  _doc?: IPost;
  description: string;
  body: string;
  mediaId: number;
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
