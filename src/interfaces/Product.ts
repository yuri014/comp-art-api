import { Document } from 'mongoose';

import { IArtistProfile } from './Profile';
import { IUpload } from './Upload';

export interface IProduct extends Document {
  _doc?: IProduct;
  name: string;
  description: string;
  value: number;
  category: string;
  image: Array<string>;
  phone: string;
  createdAt: string;
  artist: string | IArtistProfile;
}

export interface IProductInput {
  artist: string;
  name: string;
  description?: string;
  value: number;
  category: string;
  image: Promise<IUpload>;
  phone: string;
}
