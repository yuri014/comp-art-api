import { Document } from 'mongoose';
import { IPost } from './Post';
import { IArtistProfile, IUserProfile } from './Profile';

export interface Comment extends Document {
  _doc?: Comment;
  post: string | IPost;
  comments: [
    {
      author: string | IArtistProfile | IUserProfile;
      onModel: string;
      body: string;
      createdAt: string;
    },
  ];
}
