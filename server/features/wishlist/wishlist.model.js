import { Schema } from '#lib';
import mongoose from 'mongoose';

const Wishlist = new Schema({
  name: 'Wishlist',
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
}, {
  timestamps: true,
});

Wishlist.statics.fillables = [];
Wishlist.statics.hidden = [];

export default Wishlist.makeModel();
