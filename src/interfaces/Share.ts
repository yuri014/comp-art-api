import { Document } from 'mongoose';
import { IPost } from './Post';
import { IArtistProfile, IUserProfile } from './Profile';

export interface IShare extends Document {
  _doc?: IShare;
  description: string;
  post: string | IPost;
  isAudio: boolean;
  likes: [
    {
      profile: IArtistProfile | IUserProfile | string;
      onModel: string;
    },
  ];
  likesCount: number;
  sharedCount: number;
  commentsCount: number;
  createdAt: string;
  artist: string | IUserProfile;
}
