import { Document } from 'mongoose';
import { IUpload } from './Upload';

export interface IPostInput {
  description: string;
  body: Promise<IUpload>;
  isAudio: boolean;
}

export interface IPost extends Document {
  description: string;
  body: string;
  isAudio: boolean;
  likes: [
    {
      username: string;
      avatar: string;
      createdAt: string;
    },
  ];
  likesCount: number;
  sharedCount: number;
  commentsCount: number;
  createdAt: string;
  artist: {
    name: string;
    username: string;
  };
}
