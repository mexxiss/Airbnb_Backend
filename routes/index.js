import express from "express";
import userRoute from "./Users/users.route.js";
import adminRoutes from "./Admin/admin.route.js";
import { Auth } from "../middleware/auth.js";
import { Role } from "../utils/validations/roleValidator.js";

const router = express.Router();

router.use("/", userRoute); 
router.use("/admin", Auth, Role(["Admin"]), adminRoutes); 

export default router;