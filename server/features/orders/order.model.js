import { Schema } from '#lib';

const Order = new Schema({
  name: 'Order',
  schema: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      status: { type: String, default: 'pending', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
      note: { type: String, default: '' },

      products: [
        {
          product: { type: Schema.Types.ObjectId, ref: 'Product' },
          quantity: { type: Number, default: 1 },
        },
      ],
      payment: {
        method: { type: String, default: 'cod', enum: ['cod', 'paypal', 'stripe'] },
        status: { type: String, default: 'pending', enum: ['pending', 'paid', 'failed'] },
      },
      shipping: {
        method: { type: String, default: 'std', enum: ['std', 'exp', 'smd'] },
        address: { type: String, required: true },
        start_ship_date: { type: Date, default: null },
        expected_ship_date: { type: Date, default: null },
        shipped_date: { type: Date, default: null },
        fee: { type: Number, default: 0 },
      },
      review: {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      }
    },
    { timestamps: true },
  ],
});

Order.statics.fillables = [];
Order.statics.hidden = [];


Order.pre('delete', async function (next) {
  const order = this;
  await order.model('Review').deleteOne({ _id: order.review });
  next();
});


export default Order.makeModel();
