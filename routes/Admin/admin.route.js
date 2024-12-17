import express from "express";
import { GetUser, SignUp, UpdateUser } from "../../controllers/Users.js";
import { getAllUsers, getUserById, softDeleteUserById, updateUserById, } from "../../controllers/admin/user-controllers/usersControllers.js";
import amenitiesValidator from "../../utils/validations/amenitiesValidatior.js";
import { createAmenities, deleteAmenities, getAllAmenities, getAmenitiesById, updateAmenities } from "../../controllers/Amenities.js";
import { AddBlogCategory, GetBlogCategories } from "../../controllers/BlogCategory.js";
import { AddBlogs } from "../../controllers/Blogs.js";
import { DeleteBookedDates, UpdateBookedDates } from "../../controllers/BookedDates.js";
import { getContactus, updateContactUs } from "../../controllers/ContactUs.js";
import { SetDubaiDetails } from "../../controllers/Dubai.js";
import { DeleteFaq, SetFaqs, UpdateFaq } from "../../controllers/Faq.js";
import { DeleteGallaryType, SetGallaryType } from "../../controllers/GallaryTypes.js";
import galleryValidator from "../../utils/validations/galleryValidator.js";
import { createGalleryContent, UpdateGallary } from "../../controllers/Gallery.js";
import { SetHomeContent, UpdateHomeContent } from "../../controllers/HomeContent.js";
import { AddLegal } from "../../controllers/Legal.js";
import { AddMaintenance } from "../../controllers/Maintenance.js";
import { AddFeaturedArticles } from "../../controllers/MediaFeaturedArticles.js";
import { AddPricing, DeletePricing, UpdatePricing } from "../../controllers/Pricing.js";
import { DeleteProperty, SetProperty, UpdateProperty } from "../../controllers/Properties.js";
import { AddRequirements } from "../../controllers/Requirements.js";
import { SetProviders } from "../../controllers/ServiceProviders.js";
import { SetService } from "../../controllers/Services.js";
import { DeleteSubscription, GetSubscriptions } from "../../controllers/Subscriptions.js";
import { SetTestimonials } from "../../controllers/Testimonials.js";
import { AddThirdPartyLogos, UpdateThirdPartyLogos } from "../../controllers/ThirdPartyLogos.js";
import { SetUtility } from "../../controllers/Utility.js";
import { AddVideoGuide } from "../../controllers/VideoGuides.js";

const router = express.Router();

// Authentication Routes
router.post("/signup", SignUp);

// users crud apis
router.get("/users", getAllUsers);
router.put("/users/:id", updateUserById);
router.get("/users/:id", getUserById);
router.delete("/users/:id", softDeleteUserById);

// Amenities Routes
router.post("/amenities/", amenitiesValidator, createAmenities);
router.get("/amenities/", getAllAmenities);
router.delete("/amenities/:id", deleteAmenities);
router.put("/amenities/:id", updateAmenities);
router.get("/amenities/:id", getAmenitiesById);

// Blog Categories Routes
router.post("/blog-categories/", AddBlogCategory);
router.get("/blog-categories/", GetBlogCategories);

// Blogs Routes
router.post("/blogs/", AddBlogs);

// Booked Dates Routes
router.put("/booked-dates/:id", UpdateBookedDates);
router.delete("/booked-dates/:id", DeleteBookedDates);

// Contact Us Routes
router.put("/contact-us/:id", updateContactUs);

// Airbnb Dubai Content Routes
router.post("/airbnb-dubai/", SetDubaiDetails);

// FAQs Routes
router.post("/faqs/", SetFaqs);
router.delete("/faqs/:id", DeleteFaq);
router.put("/faqs/:id", UpdateFaq);

// Gallary Types Routes
router.post("/gallery-types/", SetGallaryType);
router.delete("/gallery-types/:id", DeleteGallaryType);

// Gallery Routes
router.post("/gallery/", galleryValidator, createGalleryContent);
router.put("/gallery/:id", UpdateGallary);

// Home Content Routes
router.post("/home-content/", SetHomeContent);
router.put("/home-content/:id", UpdateHomeContent);

// Legal Routes
router.post("/legals/", AddLegal);

// Maintenance Routes
router.post("/maintenance/", AddMaintenance);

// Media Featured Articles Routes
router.post("/featured-articles/", AddFeaturedArticles);

// Pricing Content Routes
router.post("/pricing/", AddPricing);
router.put("/pricing/:id", UpdatePricing);
router.delete("/pricing/:id", DeletePricing);

// Properties Routes
router.post("/properties/", SetProperty);
router.delete("/properties/:id", DeleteProperty);
router.put("/properties/:id", UpdateProperty);

// Requirements Routes
router.post("/requirements/", AddRequirements);

// Service Providers Routes
router.post("/providers/", SetProviders);

// Services Routes -  Cleaning & Maintenance, Interior Design
router.post("/services/add-service", SetService);

// subscriptions Routes 
router.get("/subscriptions/", GetSubscriptions);
router.delete("/subscriptions/:id", DeleteSubscription);

// Testimonials Route
router.post("/testimonials/", SetTestimonials);

// Third Party Logos
router.post("/third-party-logos/", AddThirdPartyLogos);
router.put("/third-party-logos/:id", UpdateThirdPartyLogos);

// Utilities - VAT Tax, Income Tax
router.post("/utility/", SetUtility);

// Video Guides Routes
router.post("/guides/", AddVideoGuide);

export default router;