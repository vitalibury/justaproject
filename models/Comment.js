import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentShema = new Schema({
  post: {
    ref: 'posts',
    type: Schema.Types.ObjectId,
    required: true
  },
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId,
    required: true
  },
  forComment: {
    ref: 'comments',
    type: Schema.Types.Mixed,
    default: ''
  },
  level: {
    type: Number,
    required: true,
    default: 0
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('comments', commentShema);