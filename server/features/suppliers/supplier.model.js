import { ProductModel } from '#features';
import { Schema } from '#lib';
import { ImageSchema } from '#utils';

const Supplier = new Schema({
  name: 'Supplier',
  schema: [
    {
      name: {
        type: String,
        unique: [true, 'Supplier name must be unique'],
        required: [true, 'Supplier name is required'],
      },
      slug: {
        type: String,
      },
      contactPerson: {
        type: String,
        required: [true, 'Contact person is required'],
      },
      emailAddress: {
        type: String,
        required: [true, 'Email address is required'],
        unique: [true, 'Email already exists'],
      },
      contactNumber: {
        type: String,
        required: [true, 'Please enter supplier contact number'],
        maxLength: [11, 'Supplier contact number cannot exceed 11 characters']
      },
      description: {
        type: String,
      },
      images: [ImageSchema],
    },
    { timestamps: true },
  ],
});

Supplier.statics.fillables = [];
Supplier.statics.hidden = [];

Supplier.pre('delete', async function (next) {
  const supplier = this;
  const products = await ProductModel.find({ supplier: supplier._id });
  products.forEach((product) => {
    product.supplier = null;
    product.save();
  });
  next();
});

export default Supplier.makeModel();

