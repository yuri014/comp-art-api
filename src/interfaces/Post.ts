import { Document } from 'mongoose';
import { IArtistProfile, IUserProfile } from './Profile';
import { IUpload } from './Upload';

export interface IPostInput {
  description: string;
  body: Promise<IUpload>;
  isAudio: boolean;
}

export interface IPost extends Document {
  _doc?: IPost;
  description: string;
  body: string;
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
  avatar: string;
  artist: string | IArtistProfile;
}
