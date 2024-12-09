import express from "express";
import { Auth } from "../middleware/auth.js";
import { ChangePassword, GetUser, Login, Logout, SignUp, UpdateUser } from "../controllers/Users.js";

const router = express.Router();

router.post('/signup', SignUp)
router.post('/login', Login)
router.post('/logout', Auth, Logout)
router.post('/change-pass', Auth, ChangePassword);
router.put('/', Auth, UpdateUser);
router.get('/', Auth, GetUser);

export default router