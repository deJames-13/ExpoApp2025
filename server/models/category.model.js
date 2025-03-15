import Model from './model.js';

const categorySchema = [
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    // Add more schema fields as needed
  },
  { timestamps: true },
];

const Category = new Model({ name: 'Category', schema: categorySchema });

// Define fillable fields
Category.statics.fillables = ['name'];

// Define hidden fields
Category.statics.hidden = [];

// Add any custom methods here
// Example:
// Category.methods.customMethod = function() {
//   // Custom method implementation
// };

export default Category.makeModel();
