import { Document } from 'mongoose';

import { IPost } from './Post';
import { IOnModel } from './General';
import { IArtistProfile, IUserProfile } from './Profile';

export interface Comment extends Document {
  _doc?: Comment;
  post: string | IPost;
  comments: [
    {
      author: string | IArtistProfile | IUserProfile;
      onModel: IOnModel;
      body: string;
      createdAt: string;
      likes?: [
        {
          author: string | IArtistProfile | IUserProfile;
          onModel: IOnModel;
        },
      ];
    },
  ];
}
