import { Schema } from '#lib';
import { ImageSchema } from '#utils';

const UserInfo = new Schema({
  name: 'UserInfo',
  schema: [
    {
      avatar: ImageSchema,
      first_name: {
        type: String,
        required: [true, 'First name is required'],
      },
      last_name: {
        type: String,
        required: [true, 'Last name is required'],
      },
      contact: {
        type: String,
        required: [true, 'Contact is required'],
        regex: /^[0-9]{10}$/,
        unique: [true, 'Contact already exists'],
      },
      birthdate: {
        type: Date,
      },
      address: {
        type: String,
        required: [true, 'Address is required'],
      },
      city: {
        type: String,
        required: [true, 'City is required'],
      },
      region: {
        type: String,
        required: [true, 'Region is required'],
      },
      zip_code: {
        type: String,
      },
      photoUrl: {
        type: String,
      }
    },
  ],
});

// Define fillable properties
UserInfo.statics.fillables = [
  'first_name',
  'last_name',
  'contact',
  'birthdate',
  'address',
  'city',
  'region',
  'zip_code',
  'avatar',
  'photoUrl'
];

export default UserInfo.makeModel();

