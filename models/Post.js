import mongoose from "mongoose";

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    required: true,
    type: String
  },
  description: {
    type: String,
    default: ''
  },
  imageSrc: {
    required: true,
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  },
  email: {
    required: true,
    type: String
  }
});

export default mongoose.model('posts', postSchema);