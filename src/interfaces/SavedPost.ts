import { Document } from 'mongoose';

import { IOnModel } from './General';
import { IPost } from './Post';
import { IProfile } from './Profile';
import { IShare } from './Share';

interface ISavedPost extends Document {
  profile: string | IProfile;
  onModel: IOnModel;
  posts: Array<{
    post: string;
    onModel: 'Share' | 'Post';
  }>;
}

export type ISavedPostService = (
  isAlreadySave: ISavedPost | null,
  profileID: string,
  savedPost: IShare | IPost | null,
  isArtist?: boolean,
) => Promise<boolean>;

export default ISavedPost;
