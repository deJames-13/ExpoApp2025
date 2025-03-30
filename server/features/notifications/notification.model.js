import { Schema } from '#lib';
import { ImageSchema } from '#utils';

const Notification = new Schema({
  name: 'Notification',
  schema: [
    {
      title: String,
      body: String,
      data: Object,
      status: {
        type: String,
        enum: ['none', 'active', 'important'],
        default: 'active'
      },

      // Changed from enum to simple String to allow any value
      type: {
        type: String,
        default: 'info'
      },
      isRead: {
        type: Boolean,
        default: false
      },
      user: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true },
  ],
});

Notification.statics.fillables = [];
Notification.statics.hidden = [];

export default Notification.makeModel();
