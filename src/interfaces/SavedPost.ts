import { Document } from 'mongoose';

import { IPost } from './Post';
import { IShare } from './Share';
import { IToken } from './Token';
import { IUser } from './User';

interface ISavedPost extends Document {
  profile: string | IUser;
  posts: Array<{
    post: string;
    onModel: 'Share' | 'Post';
  }>;
}

export type ISavedPostService = (
  user: IToken,
  isAlreadySave: ISavedPost | null,
  savedPost: IShare | IPost | null,
) => Promise<boolean>;

export default ISavedPost;
