import { Router } from "express";
import { createPost, deletePost, getAllPosts, getUserPosts } from "../controllers/post.js";

const router = new Router();

router.get('/', getAllPosts);
router.get('/:id', getUserPosts);
router.post('/:id', createPost);
router.delete('/:id', deletePost);

export default router;