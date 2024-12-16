import express from "express";
import userRoute from "./Users/index.js";
import otherRoute from "./others/others.route.js";
import adminRoutes from "./Admin/index.js";

const router = express.Router();

router.use("/", userRoute);
router.use("/", otherRoute);
router.use("/", adminRoutes); 

export default router