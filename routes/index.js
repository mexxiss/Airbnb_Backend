import express from "express";
import { Auth } from "../middleware/auth.js";
import userRoute from "./Users.js";
import otpRoute from "./Otp.js";
import passResetRoute from "./PassReset.js";
import servicesRoute from "./Services.js";
import faqsRoute from "./Faq.js";
import homeContentRoute from "./HomeContent.js";
import uploadRoute from "./Upload.js";
import amenitiesRoute from "./Amenities.js";

const router = express.Router();

router.use("/users", userRoute);
router.use("/faqs", faqsRoute);
router.use("/otp", otpRoute);
router.use("/pass-reset", passResetRoute);
router.use("/services", servicesRoute);
router.use("/home-content", homeContentRoute);
router.use("/upload", uploadRoute);
// js
router.use("/amenities", amenitiesRoute);

export default router;
