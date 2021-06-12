import { Document } from 'mongoose';

import { IPost } from './Post';
import { IOnModel } from './General';
import { IProfileEntity } from './Models';

export interface Comment extends Document {
  _doc?: Comment;
  post: string | IPost;
  onModel: 'Share' | 'Post';
  likesCount: number;
  comments: Array<{
    author: string | IProfileEntity;
    onModel: IOnModel;
    body: string;
    createdAt: string;
    likes?: Array<{
      author: string | IProfileEntity;
      onModel: IOnModel;
    }>;
  }>;
}
