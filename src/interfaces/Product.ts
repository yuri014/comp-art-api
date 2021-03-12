import { Document } from 'mongoose';

import { IArtistProfile } from './Profile';

export interface IProduct extends Document {
  _doc?: IProduct;
  name: string;
  description: string;
  value: number;
  category: string;
  image: Array<string>;
  createdAt: string;
  artist: string | IArtistProfile;
}
