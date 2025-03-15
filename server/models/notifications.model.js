import Model from './model.js';

const notificationsSchema = [
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    // Add more schema fields as needed
  },
  { timestamps: true },
];

const Notifications = new Model({ name: 'Notifications', schema: notificationsSchema });

// Define fillable fields
Notifications.statics.fillables = ['name'];

// Define hidden fields
Notifications.statics.hidden = [];

// Add any custom methods here
// Example:
// Notifications.methods.customMethod = function() {
//   // Custom method implementation
// };

export default Notifications.makeModel();
