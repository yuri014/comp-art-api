import mongoose, { Schema } from 'mongoose';

import { IProduct } from '../interfaces/Product';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  images: [{ type: String, required: true }],
  phone: [{ type: String, required: true }],
  createdAt: { type: String, required: true },
  artist: {
    type: Schema.Types.String,
    ref: 'ArtistProfile',
  },
});

export default mongoose.model<IProduct>('Product', ProductSchema);
