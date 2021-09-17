import { Router } from "express";
import { getAllUsers, getUserByEmail, removeUser, updateUser } from "../controllers/user.js";

const router = new Router();

router.get('/', getAllUsers);
router.get('/:email', getUserByEmail);
router.post('/:email', updateUser);
router.delete('/:email', removeUser);

export default router;