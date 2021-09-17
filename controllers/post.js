import Post from "../models/Post.js";
import errorHandler from "../utils/errorHandler.js";

export const getUserPosts = async (req, res) => {
  const posts = await Post.find({email: req.params.email});
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
    email: req.params.email
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

