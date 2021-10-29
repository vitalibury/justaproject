import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getUserPosts,
  changePostRate,
  getPostWithComments,
  getPostComments,
  createPostComment,
  deletePostComment,
} from "../controllers/post.js";

const router = new Router();

router.get("/:id", getAllPosts);
router.get("/user/:id", getUserPosts);
router.post("/:id", createPost);
router.delete("/:id", deletePost);
router.post("/rate/:id", changePostRate);
router.get("/:id/comments/:userId", getPostWithComments);
router.get("/:id/comments", getPostComments);
router.post("/:id/comments", createPostComment);
router.delete("/:id/comments", deletePostComment);

export default router;
