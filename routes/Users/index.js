import express from "express";
import userRoute from "./users.route.js";
import { Role } from "../../utils/validations/roleValidator.js";
import { Auth } from "../../middleware/auth.js";

const router = express.Router();

router.use("/users", Auth, userRoute);

export default router;