import mongoose, { Schema } from 'mongoose';

import { IProduct } from '../interfaces/Product';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  images: [{ type: String, required: true }],
  createdAt: { type: String, required: true },
  reviewsStars: [Number],
  reviews: [
    {
      author: { type: Schema.Types.String, refPath: 'likes.onModel' },
      onModel: { type: String, required: true, enum: ['ArtistProfile', 'UserProfile'] },
      review: String,
      createdAt: String,
    },
  ],
  totalSales: { type: Number, required: true, default: 0 },
  artist: {
    type: Schema.Types.String,
    ref: 'ArtistProfile',
  },
});

export default mongoose.model<IProduct>('Product', ProductSchema);
