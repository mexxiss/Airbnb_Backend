import express from "express";
import {
  contactValidator,
  contactQuerySendValidator,
} from "../../utils/validations/contactvalidator.js";
import { ForgotPassword, Login, ResetPassword, VerifyOtp } from "../../controllers/general/users/users.controllers.js";
import {
  GetBlog,
  GetBlogs,
} from "../../controllers/general/blogs/blogs.controllers.js";
import { SetBookDetails } from "../../controllers/general/booking/details.controllers.js";
import {
  calculateCosts,
  GetBookedDates,
  SetBookedDates,
} from "../../controllers/general/booking/dates.controllers.js";
import {
  getContactus,
  sendContactQuery,
} from "../../controllers/general/contact/contact.controllers.js";
import { GetDubaiDetails } from "../../controllers/general/content/airbnbdubai.controllers.js";
import {
  GetAreas,
  GetEstimatedRevenue,
} from "../../controllers/general/content/estimaterevenue.controllers.js";
import { GetFilteredFaqs } from "../../controllers/general/content/faqs.controllers.js";
import { GetGallaryTypes } from "../../controllers/general/properties/gallerytypes.controllers.js";
import { getGalleryImagesByQuery } from "../../controllers/general/properties/gallery.controllers.js";
import { GetHomeContent } from "../../controllers/general/content/homecontent.controllers.js";
import { GetLegals } from "../../controllers/general/content/legal.controllers.js";
import { GetFeaturedArticles } from "../../controllers/general/content/featuredarticles.controllers.js";
import { GetPricings } from "../../controllers/general/content/pricing.controllers.js";
import { GetAllProperties, getFilteredPropertiesForBooking, GetFullPropertiesObject, getFullPropertyById, getPropertiesForBooking, GetPropertyObj } from "../../controllers/general/properties/properties.controllers.js";
import { GetRequirements } from "../../controllers/general/content/requirements.controllers.js";
import { GetServices } from "../../controllers/general/content/services.controllers.js";
import { SetSubscription } from "../../controllers/general/subscriptions/subscriptions.controllers.js";
import { GetTestimonials } from "../../controllers/general/content/testimonials.controllers.js";
import { GetThirdPartyLogos } from "../../controllers/general/content/thirdpartylogos.controllers.js";
import { GetVideoGuides } from "../../controllers/general/content/guides.controllers.js";
import { GetUIContent } from "../../controllers/general/content/uicontent.controllers.js";
import { AddPropertyQuery } from "../../controllers/general/contact/propertyquery.controllers.js";

const router = express.Router();

// Authentication Routes
router.post("/login", Login);
router.post("/forgot-pass", ForgotPassword);
router.post("/verify-otp", VerifyOtp);
router.post("/reset-pass", ResetPassword);

// Blogs Routes
router.get("/blogs/", GetBlogs);
router.get("/blogs/:id", GetBlog);

// Book Details Routes
router.post("/book-details/", SetBookDetails);

// Booked Dates Routes
router.get("/booked-dates/", GetBookedDates);
router.post("/booked-dates/", SetBookedDates);
router.get("/booked-dates/calculate", calculateCosts)

// Contact Us Routes
router.get("/contact-us/", getContactus);
router.post("/contact-us/query", contactQuerySendValidator, sendContactQuery);
router.post("/property-query", AddPropertyQuery);

// Airbnb Dubai Content Routes
router.get("/airbnb-dubai/", GetDubaiDetails);

// Estimate Revenue Routes
router.get("/estimate-revenue/", GetAreas);
router.get("/estimate-revenue/:id", GetEstimatedRevenue);

//FAQs Routes
router.get("/faqs/", GetFilteredFaqs);

// Gallery Types Routes
router.get("/gallery-types/", GetGallaryTypes);

// Gallery Routes
router.get("/gallery", getGalleryImagesByQuery);

// Home Content Routes
router.get("/home-content/", GetHomeContent);

// Legal Routes
router.get("/content", GetLegals);

// Media Featured Articles Routes
router.get("/featured-articles/", GetFeaturedArticles);

// Pricing Content Routes
router.get("/pricing/", GetPricings);

// Properties Routes
router.get("/properties/", GetAllProperties);
router.get("/properties/all", GetFullPropertiesObject);
router.post("/properties/filters", getFilteredPropertiesForBooking);
router.get("/properties/booking", getPropertiesForBooking);
router.get("/properties/:id", GetPropertyObj);
router.get("/property/:id", getFullPropertyById)

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

// UI Content Routes
router.get("/ui-content/", GetUIContent);

export default router;
