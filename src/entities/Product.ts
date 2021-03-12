import mongoose, { Schema } from 'mongoose';

import { IProduct } from '../interfaces/Product';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  value: { type: Number, required: true },
  category: { type: String, required: true },
  image: [{ type: String, required: true }],
  createdAt: { type: String, required: true },
  artist: {
    type: Schema.Types.ObjectId,
    ref: 'ArtistProfile',
  },
});

export default mongoose.model<IProduct>('Product', ProductSchema);
