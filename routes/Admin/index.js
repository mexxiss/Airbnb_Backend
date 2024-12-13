import express from "express";
import adminRoutes from "./admin.route.js";
import { Auth } from "../../middleware/auth.js";
import { Role } from "../../utils/validations/roleValidator.js";

const router = express.Router();

router.use("/admin", Auth, Role(["Admin"]), adminRoutes); // Role can be either Admin or Owner - case sensitive

export default router;
