import Model from './model.js';

const reviewsSchema = [
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    // Add more schema fields as needed
  },
  { timestamps: true },
];

const Reviews = new Model({ name: 'Reviews', schema: reviewsSchema });

// Define fillable fields
Reviews.statics.fillables = ['name'];

// Define hidden fields
Reviews.statics.hidden = [];

// Add any custom methods here
// Example:
// Reviews.methods.customMethod = function() {
//   // Custom method implementation
// };

export default Reviews.makeModel();
