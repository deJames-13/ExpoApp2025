import Model from './model.js';

const cartSchema = [
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    // Add more schema fields as needed
  },
  { timestamps: true },
];

const Cart = new Model({ name: 'Cart', schema: cartSchema });

// Define fillable fields
Cart.statics.fillables = ['name'];

// Define hidden fields
Cart.statics.hidden = [];

// Add any custom methods here
// Example:
// Cart.methods.customMethod = function() {
//   // Custom method implementation
// };

export default Cart.makeModel();
