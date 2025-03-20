import { Schema } from '#lib';
import { ImageSchema } from '#utils';

const Courier = new Schema({
  name: 'Courier',
  schema: [
    {
      name: {
        type: String,
        unique: [true, 'Courier name must be unique'],
        required: [true, 'Courier name is required'],
      },
      slug: {
        type: String,
      },
      contactPerson: {
        type: String,
        required: [true, 'Contact person is required'],
      },
      contactNumber: {
        type: Number,
        required: [true, 'Please enter courier contact number'],
        maxLength: [11, 'Courier contact number cannot exceed 11 characters'],
      },
      emailAddress: {
        type: String,
        required: [true, 'Email address is required'],
        unique: [true, 'Email already exists'],
      },
      serviceArea: {
        type: String,
        required: [true, 'Please enter courier service area'],
        maxLength: [50, 'Courier service area cannot exceed 50 characters'],
      },
      images: [ImageSchema],
    },
    { timestamps: true },
  ],
});

Courier.statics.fillables = [];
Courier.statics.hidden = [];

export default Courier.makeModel();

