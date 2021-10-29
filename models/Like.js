import mongoose from "mongoose";

const Schema = mongoose.Schema;

const likeShema = new Schema({
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId,
    required: true
  },
  post: {
    ref: 'posts',
    type: Schema.Types.ObjectId,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('likes', likeShema);