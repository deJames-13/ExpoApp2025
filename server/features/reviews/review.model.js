import { OrderModel, ProductModel } from '#features';
import { Schema } from '#lib';
import { ImageSchema } from '#utils';
import mongoose from 'mongoose';

const reviewSchema = new Schema({
  name: 'Review',
  schema: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
      },
      title: {
        type: String,
        default: ''
      },
      rating: {
        type: Number,
        required: [true, 'Please provide a rating'],
        min: 1,
        max: 10,
        validate: {
          validator: Number.isInteger,
          message: 'Rating must be an interger between 1 and 10'
        }
      },
      description: {
        type: String,
        default: '',
      },
      isAnonymous: {
        type: Boolean,
        default: false
      },
    images: [ImageSchema]
    },
    { timestamps: true }
  ],
});

// pre delete
reviewSchema.pre('delete', async function (next) {
  const review = this;
  const order = await OrderModel.findById(review.order);
  if (!order) {
    return next(new Error('Order not found'));
  }
  order.review = null;
  order.save();

  const products = await ProductModel.find({ _id: { $in: order.products.map(p=>p.product) } });
  products.forEach((product) => {
    if (!product.reviews.includes(mongoose.Types.ObjectId(review._id))) {
      product.reviews = product.reviews.filter((r) => r.toString() !== review._id.toString());
      product.save();
    }
  });
});


// post insertMany
reviewSchema.post('insertMany', async function (docs, next) {
  try {
    if (!Array.isArray(docs)) {
      return next(new Error('Expected an array of inserted reviews.'));
    }

    await Promise.all(
      docs.map(async (review) => {
        // Find the associated order
        const order = await OrderModel.findById(review.order);
        if (!order) {
          throw new Error(`Order not found for review with ID: ${review._id}`);
        }

        order.review = review._id;
        await order.save();

        const productIds = order.products.map((p) => p.product); // Extract product IDs
        await ProductModel.updateMany(
          { _id: { $in: productIds } },
          { $addToSet: { reviews: review._id } } // Prevent duplicate entries
        );
      })
    );

    next();
  } catch (error) {
    console.error('Error in review post-insertMany middleware:', error);
    next(error);
  }
});



export default reviewSchema.makeModel();
