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
import galleryRoute from "./Gallery.js";
import gallaryTypesRoute from "./GallaryTypes.js";
import contactUsRoute from "./ContactUs.js";
import propertiesRoute from "./Properties.js";

const router = express.Router();

router.use("/users", userRoute);
router.use("/faqs", faqsRoute);
router.use("/otp", otpRoute);
router.use("/pass-reset", passResetRoute);
router.use("/services", servicesRoute);
router.use("/home-content", homeContentRoute);
router.use("/upload", uploadRoute);
router.use("/amenities", amenitiesRoute);
router.use("/gallery", galleryRoute);
router.use("/contact-us", contactUsRoute);
router.use("/gallery-types", gallaryTypesRoute);
router.use("/properties", propertiesRoute);

export default router;
