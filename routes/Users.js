import express from "express";
import { Auth } from "../middleware/auth.js";
import { Login, Logout, SignUp } from "../controllers/Users.js";

const router = express.Router();

router.post('/signup', SignUp)
router.post('/login', Login)
router.post('/logout', Auth, Logout)

export default router