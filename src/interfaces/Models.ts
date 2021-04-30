import { Model } from 'mongoose';

import { IPost } from './Post';
import { IShare } from './Share';

export type PostEntity = Model<IPost> | Model<IShare>;
