import { Router } from "express";
import { login, registration } from "../controllers/auth.js";

const router = Router();

router.post('/login', login);
router.post('/registration', registration);

export default router;