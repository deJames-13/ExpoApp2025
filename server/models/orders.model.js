import Model from './model.js';

const ordersSchema = [
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    // Add more schema fields as needed
  },
  { timestamps: true },
];

const Orders = new Model({ name: 'Orders', schema: ordersSchema });

// Define fillable fields
Orders.statics.fillables = ['name'];

// Define hidden fields
Orders.statics.hidden = [];

// Add any custom methods here
// Example:
// Orders.methods.customMethod = function() {
//   // Custom method implementation
// };

export default Orders.makeModel();
