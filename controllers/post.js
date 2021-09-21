import Post from "../models/Post.js";
import errorHandler from "../utils/errorHandler.js";

export const getAllPosts = async (req, res) => {
  const posts = await Post.find().populate('user');
  try {
    res.status(200).json(posts);
  } catch (err) {
    errorHandler(err);
  }
}

export const getUserPosts = async (req, res) => {
  const posts = await Post.find({user: req.params.id});
  try {
    res.status(200).json(posts);
  } catch (err) {
    errorHandler(err);
  }
};

export const createPost = async (req, res) => {
  const post = await new Post({
    title: req.body.title,
    description: req.body.description,
    imageSrc: req.body.imageSrc,
    user: req.params.id
  });
  try {
  await post.save();
  res.status(201).json(post);
  } catch (err) {
    errorHandler(err);
  }
};

export const deletePost = async (req, res) => {
  try {
    await Post.deleteOne({_id: req.params.id});
    res.status(200).json({
      message: 'Post has been deleted successfully.'
    })
  } catch(e) {
    errorHandler(res, e);
  }
};

