import express from "express";
import { ChangePassword, GetUser, Logout, UpdateUser } from "../../controllers/Users.js";

const router = express.Router();

// Authentication Routes
// router.post('/signup', SignUp)
// router.post('/login', Login)
router.post('/logout', Logout)
router.post('/change-pass', ChangePassword);
router.put('/', UpdateUser);
router.get('/', GetUser);

export default router;