import express from "express";
import userRoute from "./Users/index.js";
import otherRoute from "./others/others.route.js";
import adminRoutes from "./Admin/index.js";

const router = express.Router();

router.use("/", userRoute);
router.use("/", otherRoute);
router.use("/", adminRoutes); // Role can be either Admin or Owner - case sensitive

export default router;
