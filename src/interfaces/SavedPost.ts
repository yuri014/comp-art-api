import { Document } from 'mongoose';

import { IOnModel } from './General';
import { IProfile } from './Profile';

interface ISavedPost extends Document {
  profile: string | IProfile;
  onModel: IOnModel;
  posts: Array<{
    post: string;
    onModel: 'Share' | 'Post';
  }>;
}

export default ISavedPost;
