import { Document } from 'mongoose';

import { IPost } from './Post';
import { IOnModel } from './General';
import { IArtistProfile, IUserProfile } from './Profile';

export interface IShare extends Document {
  _doc?: IShare;
  description?: string;
  post: string | IPost;
  mediaId: number;
  likes: Array<{
    profile: IArtistProfile | IUserProfile | string;
    onModel: IOnModel;
  }>;
  likesCount: number;
  sharedCount: number;
  commentsCount: number;
  createdAt: string;
  profile: IArtistProfile | IUserProfile | string;
  onModel: IOnModel;
}
export interface IShareInput {
  postID: string;
  description?: string;
}
