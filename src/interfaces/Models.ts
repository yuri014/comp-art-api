import { Model } from 'mongoose';

import { IPost } from './Post';
import { IArtistProfile, IUserProfile } from './Profile';
import { IShare } from './Share';

export type PostEntity = Model<IPost> | Model<IShare>;

export type IProfileEntity = IArtistProfile | IUserProfile;

export type IProfileModel = Model<IArtistProfile> | Model<IUserProfile>;
