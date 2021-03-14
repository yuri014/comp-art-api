import { Document } from 'mongoose';

import { IArtistProfile } from './Profile';
import { IUpload } from './Upload';

export interface IProduct extends Document {
  _doc?: IProduct;
  name: string;
  description: string;
  price: number;
  category: string;
  image: Array<string>;
  phone: string;
  createdAt: string;
  artist: string | IArtistProfile;
}

export interface IProductInput {
  name: string;
  description?: string;
  price: number;
  category: string;
  images: Promise<IUpload[]>;
  phone: string;
}
