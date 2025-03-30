import { Schema } from '#lib';
import { ImageSchema } from '#utils';
import mongoose from 'mongoose';

const Product = new Schema({
  name: 'Product',
  schema: [
    {
      name: {
        type: String,
        unique: [true, 'Product name must be unique!'],
        required: [true, 'Product name is required!'],
      },
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories',
      },
      description: {
        type: String,
      },
      slug: {
        type: String,
      },
      price: {
        type: Number,
        required: [true, 'Product price is required!'],
      },
      stock: {
        type: Number,
        required: [true, 'Product stock is required!'],
      },
      brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brands',
      },
      supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Suppliers',
      },
      reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      }],
      averageRating: {
        type: Number,
        default: 0,
      },
      images: [ImageSchema],
    },
    { timestamps: true },
  ],
});

// Define fillable properties
Product.statics.fillables = [
  'name',
  'description',
  'price',
  'stock',
  'category',
  'brand',
  'supplier',
  'images',
  'averageRating',
  'slug'
];

Product.statics.hidden = ['__v'];

export default Product.makeModel();
