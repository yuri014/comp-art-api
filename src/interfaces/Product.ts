import { Document } from 'mongoose';

import { IArtistProfile } from './Profile';
import { IUpload } from './Upload';

interface Product {
  name: string;
  description?: string;
  price: number;
  category: string;
  phone: string;
}

export interface IProduct extends Document, Product {
  _doc?: IProduct;
  image: Array<string>;
  createdAt: string;
  artist: string | IArtistProfile;
}

export interface IProductInput extends Product {
  images: Promise<IUpload[]>;
}
