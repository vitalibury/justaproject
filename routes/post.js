import { Router } from "express";
import { createPost, deletePost, getUserPosts } from "../controllers/post.js";

const router = new Router();

router.get('/:email', getUserPosts);
router.post('/:email', createPost);
router.delete('/:id', deletePost);

export default router;