import express from "express";
import {
  ChangePassword,
  GetUser,
  Login,
  Logout,
  UpdateUser,
} from "../../controllers/Users.js";
import { Auth } from "../../middleware/auth.js";

const router = express.Router();

// Authentication Routes
router.post("/login", Login);
router.post("/logout", Auth, Logout);
router.post("/change-pass", Auth, ChangePassword);
router.put("/", Auth, UpdateUser);
router.get("/", Auth, GetUser);

export default router;
