import mongoose from 'mongoose';
export const ImageSchema = new mongoose.Schema({
  folder: {
    type: String,
  },
  public_id: {
    type: String,
  },
  url: {
    type: String,
  },
  secure_url: {
    type: String,
  },
  resource_type: {
    type: [String],
  },
  tags: {
    type: [String],
  },
  allowed_formats: {
    type: [String],
  },
});

