import express from "express";
import userRoute from "./users.route.js";

const router = express.Router();

router.use("/users", userRoute);

export default router;
