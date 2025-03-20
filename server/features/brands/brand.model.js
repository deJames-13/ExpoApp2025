import { ProductModel } from '#features';
import { Schema } from '#lib';
import { ImageSchema } from '#utils';

const Brand = new Schema({
  name: 'Brand',
  schema: [
    {
      name: {
        type: String,
        unique: [true, 'Brand name must be unique'],
        required: [true, 'Brand name is required'],
      },
      slug: {
        type: String,
      },
      description: {
        type: String,
        unique: [true, 'Brand name must be unique'],
        required: [true, 'Brand name is required'],
      },
      websiteUrl: {
        type: String,
        unique: [true, 'Website URL must be unique'],
        required: [true, 'Website URL is required'],
      },
      emailAddress: {
        type: String,
        required: [true, 'Email address is required'],
        unique: [true, 'Email already exists'],
      },
      images: [ImageSchema],
    },
    { timestamps: true },
  ],
});

Brand.statics.fillables = [];
Brand.statics.hidden = [];

Brand.pre('delete', async function (next) {
  const brand = this;
  const products = await ProductModel.find({ brand: brand._id });
  products.forEach((product) => {
    product.brand = null;
    product.save();
  });
  next();
});

export default Brand.makeModel();
