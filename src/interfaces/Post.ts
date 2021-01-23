import { Document } from 'mongoose';
import { IUploadImage } from './Upload';

export interface IPostInput {
  description: string;
  body: Promise<IUploadImage>;
}

export interface IPost extends Document {
  description: string;
  body: string;
  likes: [
    {
      username: string;
      avatar: string;
      createdAt: string;
    },
  ];
  sharedCount: number;
  createdAt: string;
  artist: string;
}
