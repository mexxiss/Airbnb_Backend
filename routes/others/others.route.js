import express from "express";
import { contactValidator, contactQuerySendValidator } from "../../utils/validations/contactvalidator.js";
import { Login } from "../../controllers/general/users/users.controllers.js";
import { GetBlog, GetBlogs } from "../../controllers/general/blogs/blogs.controllers.js";
import { GetBookDetails, SetBookDetails } from "../../controllers/general/booking/details.controllers.js";
import { GetBookedDates, SetBookedDates } from "../../controllers/general/booking/dates.controllers.js";
import { createContactus, getContactus, sendContactQuery } from "../../controllers/general/contact/contact.controllers.js";
import { GetDubaiDetails } from "../../controllers/general/content/airbnbdubai.controllers.js";
import { AddRevenueDetails, GetAreas } from "../../controllers/general/content/estimaterevenue.controllers.js";
import { GetFilteredFaqs } from "../../controllers/general/content/faqs.controllers.js";
import { GetGallaryTypes } from "../../controllers/general/properties/gallerytypes.controllers.js";
import { getGalleryImagesByQuery } from "../../controllers/general/properties/gallery.controllers.js";
import { GetHomeContent } from "../../controllers/general/content/homecontent.controllers.js";
import { GetLegals } from "../../controllers/general/content/legal.controllers.js";
import { GetFeaturedArticles } from "../../controllers/general/content/featuredarticles.controllers.js";
import { GetPricings } from "../../controllers/general/content/pricing.controllers.js";
import { GetAllProperties, GetPropertyObj } from "../../controllers/general/properties/properties.controllers.js";
import { GetRequirements } from "../../controllers/general/content/requirements.controllers.js";
import { GetServices } from "../../controllers/general/content/services.controllers.js";
import { SetSubscription } from "../../controllers/general/subscriptions/subscriptions.controllers.js";
import { GetTestimonials } from "../../controllers/general/content/testimonials.controllers.js";
import { GetThirdPartyLogos } from "../../controllers/general/content/thirdpartylogos.controllers.js";
import { GetVideoGuides } from "../../controllers/general/content/guides.controllers.js";

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
