import { ProductModel } from '#features';
import { Schema } from '#lib';
import { ImageSchema } from '#utils';

const Category = new Schema({
  name: 'Category',
  schema: [
    {
      name: {
        type: String,
        unique: [true, 'Category name must be unique'],
        required: [true, 'Category name is required'],
      },
      slug: {
        type: String,
      },
      images: [ImageSchema],
    },
    { timestamps: true },
  ],
});

Category.statics.fillables = [];
Category.statics.hidden = [];

Category.pre('delete', async function (next) {
  const category = this;
  const products = await ProductModel.find({ category: category._id });
  products.forEach((product) => {
    product.category = null;
    product.save();
  });
});

export default Category.makeModel();
