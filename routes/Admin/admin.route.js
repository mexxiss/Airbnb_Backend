import express from "express";
import {
  ChangePassword,
  GetUser,
  Logout,
  SignUp,
  UpdateUser,
} from "../../controllers/Users.js";
import {
  getAllUsers,
  getUserById,
  softDeleteUserById,
  updateUserById,
} from "../../controllers/admin/user-controllers/usersControllers.js";

const router = express.Router();

// Authentication Routes
router.post("/signup", SignUp);
router.post("/logout", Logout);
router.post("/change-pass", ChangePassword);
router.put("/", UpdateUser);
router.get("/", GetUser);

// users curd apis
router.get("/users", getAllUsers);
router.put("/users/:id", updateUserById);
router.get("/users/:id", getUserById);
router.delete("/users/:id", softDeleteUserById);

export default router;
