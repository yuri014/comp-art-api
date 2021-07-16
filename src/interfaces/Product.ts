import { Document } from 'mongoose';

import { IUpload } from './Upload';
import { IOnModel } from './General';
import { IArtistProfile } from './Profile';

interface Product {
  name: string;
  description?: string;
  price: number;
  category: string;
}

export interface IProduct extends Document, Product {
  _doc?: IProduct;
  image: Array<string>;
  createdAt: string;
  reviewsStars: Array<number>;
  reviews: Array<{
    author: string;
    onModel: IOnModel;
    review: string;
    createdAt: string;
  }>;
  totalSales: { type: number; required: true; default: 0 };
  artist: string | IArtistProfile;
  available: boolean;
}

export interface IProductInput extends Product {
  images: Promise<IUpload[]>;
}
