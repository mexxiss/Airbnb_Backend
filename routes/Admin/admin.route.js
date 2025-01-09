import express from "express";
import {
  getAllUsers,
  getUserById,
  SignUp,
  softDeleteUserById,
  updateUserById,
} from "../../controllers/admin/users/users.controllers.js";
import amenitiesValidator from "../../utils/validations/amenitiesValidatior.js";
import galleryValidator from "../../utils/validations/galleryValidator.js";
import {
  DeleteProperty,
  getPropertyListByAdmin,
  GetUserProperties,
  SetProperty,
  UpdateProperty,
} from "../../controllers/admin/properties/properties.controllers.js";
import {
  createAmenities,
  deleteAmenities,
  getAllAmenities,
  getAmenitiesById,
  updateAmenities,
} from "../../controllers/admin/amenitites/amenities.controllers.js";
import { AddBlogs } from "../../controllers/admin/blogs/blogs.controllers.js";
import {
  AddBlogCategory,
  GetBlogCategories,
} from "../../controllers/admin/blogs/blogcategories.controllers.js";
import {
  DeleteBookedDates,
  UpdateBookedDates,
} from "../../controllers/admin/booking/dates.controllers.js";
import {
  createContactus,
  updateContactUs,
} from "../../controllers/admin/contact/contact.controllers.js";
import { SetDubaiDetails } from "../../controllers/admin/content/airbnbdubai.controllers.js";
import {
  DeleteFaq,
  SetFaqs,
  UpdateFaq,
} from "../../controllers/admin/content/faqs.controllers.js";
import {
  DeleteGallaryType,
  GetAllGalleryTypes,
  SetGallaryType,
} from "../../controllers/admin/properties/gallerytypes.controllers.js";
import {
  createGalleryContent,
  DeleteGallery,
  UpdateGallary,
} from "../../controllers/admin/properties/gallery.controllers.js";
import {
  SetHomeContent,
  UpdateHomeContent,
} from "../../controllers/admin/content/homecontent.controllers.js";
import { AddLegal } from "../../controllers/admin/content/legal.controllers.js";
import { AddMaintenance } from "../../controllers/admin/properties/maintenance.controllers.js";
import { AddFeaturedArticles } from "../../controllers/admin/content/featuredarticles.controllers.js";
import {
  AddPricing,
  DeletePricing,
  UpdatePricing,
} from "../../controllers/admin/content/pricing.controllers.js";
import { AddRequirements } from "../../controllers/admin/content/requirements.controllers.js";
import { SetProviders } from "../../controllers/admin/providers/providers.controllers.js";
import { SetService } from "../../controllers/admin/content/services.controllers.js";
import {
  DeleteSubscription,
  GetSubscriptions,
} from "../../controllers/admin/subscriptions/subscriptions.controllers.js";
import { SetTestimonials } from "../../controllers/admin/content/testimonials.controllers.js";
import {
  AddThirdPartyLogos,
  UpdateThirdPartyLogos,
} from "../../controllers/admin/content/thirdpartylogos.controllers.js";
import {
  GetUtility,
  SetUtility,
} from "../../controllers/admin/providers/taxutility.controllers.js";
import { AddVideoGuide } from "../../controllers/admin/content/guides.controllers.js";
import {
  GetUserPaymentDetails,
  UpsertBankDetailsById,
} from "../../controllers/admin/users/bankdetails.controllers.js";
import { signUpValidator } from "../../utils/validations/signupValidator.js";
import { GetBookDetails } from "../../controllers/admin/booking/details.controllers.js";
import { contactValidator } from "../../utils/validations/contactvalidator.js";
import { AddRevenueDetails } from "../../controllers/admin/content/estimaterevenue.controllers.js";
import { getFigures } from "../../controllers/admin/dashboard/dashboard.controllers.js";
import {
  createOrUpdateMonthlyInvoice,
  generatePdf,
  getmonthalyRevenueDetail,
  getmonthalyRevenueList,
} from "../../controllers/admin/invoices/invoices.controllers.js";
import { SetUIContent } from "../../controllers/admin/content/uicontent.controllers.js";
import { addStatement } from "../../controllers/admin/properties/statements.controllers.js";
import {
  createFurnishingInvoice,
  getAllFurnishingInvoice,
  getFurnishingInvoiceById,
  updateFurnishingInvoice,
} from "../../controllers/admin/invoices/furnishing.controllers.js";
import {
  CreateMaintenance,
  GetMaintenanceInvoiceById,
  GetMaintenanceInvoiceList,
  UpdateMaintenanceInvoice,
} from "../../controllers/admin/invoices/maintenance.controllers.js";

const router = express.Router();

// Authentication Routes
router.post("/signup", signUpValidator, SignUp);

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

// Book Details Routes
router.get("/book-details/:id", GetBookDetails);

// Contact Us Routes
router.post("/contact-us/", contactValidator, createContactus);
router.put("/contact-us/:id", updateContactUs);

// Airbnb Dubai Content Routes
router.post("/airbnb-dubai/", SetDubaiDetails);

// Estimate Revenue Routes
router.post("/estimate-revenue/", AddRevenueDetails);

// FAQs Routes
router.post("/faqs/", SetFaqs);
router.delete("/faqs/:id", DeleteFaq);
router.put("/faqs/:id", UpdateFaq);

// Gallary Types Routes
router.get("/gallery-types/", GetAllGalleryTypes);
router.post("/gallery-types/", SetGallaryType);
router.delete("/gallery-types/:id", DeleteGallaryType);

// Gallery Routes
router.post("/gallery/", galleryValidator, createGalleryContent);
router.put("/gallery/:id", UpdateGallary);
router.delete("/gallery/:id", DeleteGallery);

// Home Content Routes
router.post("/home-content/", SetHomeContent);
router.put("/home-content/:id", UpdateHomeContent);

// Legal Routes
router.post("/content/", AddLegal);

// Maintenance Routes
router.post("/maintenance/", AddMaintenance);

// Media Featured Articles Routes
router.post("/featured-articles/", AddFeaturedArticles);

// Payment Details Routes
router.get("/bank-details/:id", GetUserPaymentDetails);
router.put("/bank-details/:id", UpsertBankDetailsById);

// Pricing Content Routes
router.post("/pricing/", AddPricing);
router.put("/pricing/:id", UpdatePricing);
router.delete("/pricing/:id", DeletePricing);

// Properties Routes
router.post("/properties/", SetProperty);
router.get("/properties/", getPropertyListByAdmin);
router.delete("/properties/:id", DeleteProperty);
router.put("/properties/:id", UpdateProperty);
router.get("/properties/:user", GetUserProperties);

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
router.get("/utility/", GetUtility);

// Video Guides Routes
router.post("/guides/", AddVideoGuide);

// Dashboard Routes
router.get("/dashboard", getFigures);

// Invoice Generator
router.post("/generate-pdf", generatePdf);

// UI Content Routes
router.post("/ui-content/", SetUIContent);

// Statements Routes
router.post("/statements", addStatement);

// monthly invoice Routes
router.post("/monthly-invoice", createOrUpdateMonthlyInvoice);
router.get("/monthly-invoice-revenue", getmonthalyRevenueDetail);
router.get("/monthly-invoice-list", getmonthalyRevenueList);

// furnishings invoice Routes
router.post("/furnishings", createFurnishingInvoice);
router.put("/furnishings/:id", updateFurnishingInvoice);
router.get("/furnishings-list", getAllFurnishingInvoice);
router.get("/furnishings/:id", getFurnishingInvoiceById);

//** Maintenance invoice routs */
router.post("/maintenance-invoice", CreateMaintenance);
router.get("/maintenance-invoice-list", GetMaintenanceInvoiceList);
router.get("/maintenance-invoice/:id", GetMaintenanceInvoiceById);
router.put("/maintenance-invoice/:id", UpdateMaintenanceInvoice);

export default router;
