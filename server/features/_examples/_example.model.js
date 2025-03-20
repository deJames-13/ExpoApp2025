import { Schema } from '#lib';
import { ImageSchema } from '#utils';

const _Example = new Schema({
  name: '_Example',
  schema: [
    {
      name: {
        type: String,
        unique: [true, '_Example name must be unique'],
        required: [true, '_Example name is required'],
      },
      slug: {
        type: String,
      },
      images: [ImageSchema],
    },
    { timestamps: true },
  ],
});

_Example.statics.fillables = [];
_Example.statics.hidden = [];

export default _Example.makeModel();
