import Model from './model.js';

const productSchema = [
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    // Add more schema fields as needed
  },
  { timestamps: true },
];

const Product = new Model({ name: 'Product', schema: productSchema });

// Define fillable fields
Product.statics.fillables = ['name'];

// Define hidden fields
Product.statics.hidden = [];

// Add any custom methods here
// Example:
// Product.methods.customMethod = function() {
//   // Custom method implementation
// };

export default Product.makeModel();
