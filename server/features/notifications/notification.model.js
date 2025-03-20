import { Schema } from '#lib';
import { ImageSchema } from '#utils';

const Notification = new Schema({
  name: 'Notification',
  schema: [
    {
      title: String,
      body: String,
      type: {
        type: String,
        enum: ['info', 'warning', 'error'],
      }
    },
    { timestamps: true },
  ],
});

Notification.statics.fillables = [];
Notification.statics.hidden = [];

export default Notification.makeModel();
