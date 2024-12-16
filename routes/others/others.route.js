import express from "express";
import { GetBlog, GetBlogs } from "../../controllers/Blogs.js";
import { GetBookDetails, SetBookDetails, } from "../../controllers/BookDetails.js";
import { GetBookedDates, SetBookedDates, } from "../../controllers/BookedDates.js";
import { contactQuerySendValidator, contactValidator, } from "../../utils/validations/contactvalidator.js";
import { createContactus, getContactus, sendContactQuery, } from "../../controllers/ContactUs.js";
import { GetDubaiDetails } from "../../controllers/Dubai.js";
import { AddRevenueDetails, GetAreas, } from "../../controllers/EstimateRevenue.js";
import { GetFilteredFaqs, } from "../../controllers/Faq.js";
import { GetGallaryTypes, } from "../../controllers/GallaryTypes.js";
import { getGalleryImagesByQuery, } from "../../controllers/Gallery.js";
import { GetHomeContent, } from "../../controllers/HomeContent.js";
import { GetLegals } from "../../controllers/Legal.js";
import { GetFeaturedArticles, } from "../../controllers/MediaFeaturedArticles.js";
import { GetAllProperties, GetAllPropertiesByUser, GetPropertyObj,} from "../../controllers/Properties.js";
import { GetPricings, } from "../../controllers/Pricing.js";
import { GetRequirements,} from "../../controllers/Requirements.js";
import { GetServices } from "../../controllers/Services.js";
import { SetSubscription, } from "../../controllers/Subscriptions.js";
import { GetTestimonials, } from "../../controllers/Testimonials.js";
import { GetThirdPartyLogos,} from "../../controllers/ThirdPartyLogos.js";
import { GetVideoGuides, } from "../../controllers/VideoGuides.js";
import { Login } from "../../controllers/Users.js";

const router = express.Router();

// Authentication Routes
router.post("/login", Login);

// Blogs Routes
router.get("/blogs/", GetBlogs);
router.get("/blogs/:id", GetBlog);

// Book Details Routes
router.get("/book-details/:id", GetBookDetails);
router.post("/book-details/", SetBookDetails);

// Booked Dates Routes
router.get("/booked-dates/", GetBookedDates);
router.post("/booked-dates/", SetBookedDates);

// Contact Us Routes
router.get("/contact-us/", getContactus);
router.post("/contact-us/", contactValidator, createContactus);
router.post("/contact-us/query", contactQuerySendValidator, sendContactQuery);

// Airbnb Dubai Content Routes
router.get("/airbnb-dubai/", GetDubaiDetails);

// Estimate Revenue Routes
router.post("/estimate-revenue/", AddRevenueDetails);
router.get("/estimate-revenue/", GetAreas);

//FAQs Routes
router.get("/faqs/", GetFilteredFaqs);

// Gallery Types Routes
router.get("/gallery-types/", GetGallaryTypes);

// Gallery Routes
router.get("/gallery/", getGalleryImagesByQuery);

// Home Content Routes
router.get("/home-content/", GetHomeContent);

// Legal Routes
router.get("/legals/", GetLegals);

// Media Featured Articles Routes
router.get("/featured-articles/", GetFeaturedArticles);

// Pricing Content Routes
router.get("/pricing/", GetPricings);

// Properties Routes
router.get("/properties/", GetAllProperties);
router.get("/properties/:id", GetPropertyObj);

// Requirements Routes
router.get("/requirements/", GetRequirements);

// Services Routes -  Cleaning & Maintenance, Interior Design
router.get("/services/", GetServices);

// Subscriptions Routes
router.post("/subscriptions/", SetSubscription);

// Testimonials Route
router.get("/testimonials/", GetTestimonials);

// Third Party Logos
router.get("/third-party-logos/", GetThirdPartyLogos);

// Video Guides Routes
router.get("/guides/", GetVideoGuides);

export default router;
