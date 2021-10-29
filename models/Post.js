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
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId
  },
  likes: [{
    ref: 'likes',
    type: Schema.Types.Mixed,
    default: []
  }]
});

export default mongoose.model('posts', postSchema);