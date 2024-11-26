import express from "express";
import { Auth } from "../middleware/auth.js";
import { ChangePassword, Login, Logout, SignUp } from "../controllers/Users.js";

const router = express.Router();

router.post('/signup', SignUp)
router.post('/login', Login)
router.post('/logout', Auth, Logout)
router.post('/change-pass', Auth, ChangePassword);

export default router