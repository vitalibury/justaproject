import { Router } from "express";
import { getAllUsers, getUserById, removeUser, updateUser } from "../controllers/user.js";

const router = new Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/:id', updateUser);
router.delete('/:id', removeUser);

export default router;