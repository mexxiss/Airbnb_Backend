import express from "express";
import { Auth } from "../middleware/auth.js";
import userRoute from "./Users.js";
import servicesRoute from "./Services.js";
import faqsRoute from "./Faq.js";
import homeContentRoute from "./HomeContent.js";
import uploadRoute from "./Upload.js";
import amenitiesRoute from "./Amenities.js";
import galleryRoute from "./Gallery.js";
import gallaryTypesRoute from "./GallaryTypes.js";
import contactUsRoute from "./ContactUs.js";
import propertiesRoute from "./Properties.js";
import utilityRoute from "./Utility.js";
import bookedDatesRoute from "./BookedDates.js";
import bookDetailsRoute from "./BookDetails.js";
import providersRoute from "./ServiceProviders.js";
import maintenanceRoute from "./Maintenance.js";
import estimateRevenueRoute from "./EstimateRevenue.js";
import pricingRoute from "./Pricing.js";
import testimonialsRoute from "./Testimonials.js";
import subscriptionsRoute from "./Subscriptions.js";
import videoGuidesRoute from "./VideoGuide.js";
import thirdPartyLogoRoute from "./ThirdPartyLogos.js";
import featuredArticlesRoute from "./MediaFeaturedArticles.js";
import blogsRoute from "./Blogs.js";
import blogsCategoryRoute from "./BlogCategory.js";

const router = express.Router();

router.use("/users", userRoute);
router.use("/faqs", faqsRoute);
router.use("/services", servicesRoute);
router.use("/home-content", homeContentRoute);
router.use("/upload", uploadRoute);
router.use("/amenities", amenitiesRoute);
router.use("/gallery", galleryRoute);
router.use("/contact-us", contactUsRoute);
router.use("/gallery-types", gallaryTypesRoute);
router.use("/properties", propertiesRoute);
router.use("/utility", utilityRoute)
router.use("/booked-dates", bookedDatesRoute);
router.use("/book-details", bookDetailsRoute)
router.use("/providers", providersRoute);
router.use("/maintenance", maintenanceRoute);
router.use("/estimate-revenue", estimateRevenueRoute);
router.use("/pricing", pricingRoute);
router.use("/testimonials", testimonialsRoute);
router.use("/subscriptions", subscriptionsRoute);
router.use("/guides", videoGuidesRoute);
router.use("/third-party-logos", thirdPartyLogoRoute);
router.use("/featured-articles", featuredArticlesRoute);
router.use("/blogs", blogsRoute);
router.use("/blog-categories", blogsCategoryRoute);

export default router;