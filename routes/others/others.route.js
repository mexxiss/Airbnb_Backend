import express from "express";
import { Auth } from "../../middleware/auth.js";
import amenitiesValidator from "../../utils/validations/amenitiesValidatior.js";
import {
  createAmenities,
  deleteAmenities,
  getAllAmenities,
  getAmenitiesById,
  updateAmenities,
} from "../../controllers/Amenities.js";
import {
  AddBlogCategory,
  GetBlogCategories,
} from "../../controllers/BlogCategory.js";
import { AddBlogs, GetBlog, GetBlogs } from "../../controllers/Blogs.js";
import {
  GetBookDetails,
  SetBookDetails,
} from "../../controllers/BookDetails.js";
import {
  DeleteBookedDates,
  GetBookedDates,
  GetFilteredDates,
  SetBookedDates,
  UpdateBookedDates,
} from "../../controllers/BookedDates.js";
import {
  contactQuerySendValidator,
  contactValidator,
} from "../../utils/validations/contactvalidator.js";
import {
  createContactus,
  getContactus,
  sendContactQuery,
  updateContactUs,
} from "../../controllers/ContactUs.js";
import { GetDubaiDetails, SetDubaiDetails } from "../../controllers/Dubai.js";
import {
  AddRevenueDetails,
  GetAreas,
} from "../../controllers/EstimateRevenue.js";
import {
  DeleteFaq,
  GetFilteredFaqs,
  SetFaqs,
  UpdateFaq,
} from "../../controllers/Faq.js";
import {
  DeleteGallaryType,
  GetGallaryTypes,
  SetGallaryType,
} from "../../controllers/GallaryTypes.js";
import galleryValidator from "../../utils/validations/galleryValidator.js";
import {
  createGalleryContent,
  getGalleryImagesByQuery,
  UpdateGallary,
} from "../../controllers/Gallery.js";
import {
  GetHomeContent,
  SetHomeContent,
  UpdateHomeContent,
} from "../../controllers/HomeContent.js";
import { AddLegal, GetLegals } from "../../controllers/Legal.js";
import { AddMaintenance } from "../../controllers/Maintenance.js";
import {
  AddFeaturedArticles,
  GetFeaturedArticles,
} from "../../controllers/MediaFeaturedArticles.js";
import {
  GetPaymentDetails,
  SetPaymentDetails,
  UpdatePaymentDetails,
} from "../../controllers/PaymentDetails.js";
import {
  DeleteProperty,
  GetAllProperties,
  GetPropertyObj,
  SetProperty,
  UpdateProperty,
} from "../../controllers/Properties.js";
import {
  AddPricing,
  DeletePricing,
  GetPricings,
  UpdatePricing,
} from "../../controllers/Pricing.js";
import {
  GetPropertyUtilities,
  SetPropertyUtility,
  UpdatePropertyUtility,
} from "../../controllers/PropertyUtilities.js";
import {
  AddRequirements,
  GetRequirements,
} from "../../controllers/Requirements.js";
import {
  GetProviders,
  SetProviders,
} from "../../controllers/ServiceProviders.js";
import { GetServices, SetService } from "../../controllers/Services.js";
import {
  DeleteSubscription,
  GetSubscriptions,
  SetSubscription,
} from "../../controllers/Subscriptions.js";
import {
  GetTestimonials,
  SetTestimonials,
} from "../../controllers/Testimonials.js";
import {
  AddThirdPartyLogos,
  GetThirdPartyLogos,
  UpdateThirdPartyLogos,
} from "../../controllers/ThirdPartyLogos.js";
import { UploadMultiple, UploadSingle } from "../../controllers/Upload.js";
import { upload } from "../../uploads/multer.js";
import {
  GetUserDocuments,
  SetUserDocument,
  UpdateUserDocuments,
} from "../../controllers/UserDocuments.js";
import { SetUtility } from "../../controllers/Utility.js";
import {
  AddVideoGuide,
  GetVideoGuides,
} from "../../controllers/VideoGuides.js";

const router = express.Router();

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
router.get("/blogs/", GetBlogs);
router.get("/blogs/:id", GetBlog);

// Book Details Routes
router.get("/book-details/:id", GetBookDetails);
router.post("/book-details/", SetBookDetails);

// Booked Dates Routes
router.get("/booked-dates/", GetBookedDates);
router.post("/booked-dates/", SetBookedDates);
router.get("/booked-dates/filter", GetFilteredDates);
router.put("/booked-dates/:id", UpdateBookedDates);
router.delete("/booked-dates/:id", DeleteBookedDates);

// Contact Routes
router.post("/contact-us/", contactValidator, createContactus);
router.post("/contact-us/query", contactQuerySendValidator, sendContactQuery);
router.get("/contact-us/", getContactus);
router.put("/contact-us/:id", updateContactUs);

// Airbnb Dubai Content Routes
router.post("/airbnb-dubai/", SetDubaiDetails);
router.get("/airbnb-dubai/", GetDubaiDetails);

// Estimate Revenue Routes
router.post("/estimate-revenue/", AddRevenueDetails);
router.get("/estimate-revenue/", GetAreas);

//FAQs Routes
router.get("/faqs/", GetFilteredFaqs);
router.post("/faqs/", SetFaqs);
router.delete("/faqs/:id", DeleteFaq);
router.put("/faqs/:id", UpdateFaq);

// Gallery Types Routes
router.get("/gallery-types/", GetGallaryTypes);
router.post("/gallery-types/", SetGallaryType);
router.delete("/gallery-types/:id", DeleteGallaryType);

// Gallery Routes
router.post("/gallery/", galleryValidator, createGalleryContent);
router.get("/gallery/", getGalleryImagesByQuery);
router.put("/gallery/:id", UpdateGallary);

// Home Content Routes
router.get("/home-content/", GetHomeContent);
router.post("/home-content/", SetHomeContent);
router.put("/home-content/:id", UpdateHomeContent);

// Legal Routes
router.post("/legals/", AddLegal);
router.get("/legals/", GetLegals);

// Maintenance Routes
router.post("/maintenance/", AddMaintenance);

// Media Featured Articles Routes
router.post("/featured-articles/", AddFeaturedArticles);
router.get("/featured-articles/", GetFeaturedArticles);

// Payment Details Routes
router.post("/payment-details/", Auth, SetPaymentDetails);
router.get("/payment-details/", Auth, GetPaymentDetails);
router.put("/payment-details/:id", Auth, UpdatePaymentDetails);

// Pricing Content Routes
router.post("/pricing/", AddPricing);
router.get("/pricing/", GetPricings);
router.put("/pricing/:id", UpdatePricing);
router.delete("/pricing/:id", DeletePricing);

// Properties Routes
router.get("/properties/", Auth, GetAllProperties);
router.get("/properties/:id", GetPropertyObj);
router.post("/properties/", SetProperty);
router.delete("/properties/:id", DeleteProperty);
router.put("/properties/:id", UpdateProperty);

// Property Utilities Routes
router.post("/property-utilities/", Auth, SetPropertyUtility);
router.get("/property-utilities/", Auth, GetPropertyUtilities);
router.put("/property-utilities/:id", Auth, UpdatePropertyUtility);

// Requirements Routes
router.post("/requirements/", AddRequirements);
router.get("/requirements/", GetRequirements);

// Service Providers Routes
router.post("/providers/", SetProviders);
router.get("/providers/", GetProviders);

// Services Routes -  Cleaning & Maintenance, Interior Design
router.post("/services/add-service", SetService);
router.get("/services/", GetServices);

// Subscriptions Routes
router.post("/subscriptions/", SetSubscription);
router.get("/subscriptions/", GetSubscriptions);
router.delete("/subscriptions/:id", DeleteSubscription);

// Testimonials Route
router.post("/testimonials/", SetTestimonials);
router.get("/testimonials/", GetTestimonials);

// Third Party Logos
router.post("/third-party-logos/", AddThirdPartyLogos);
router.get("/third-party-logos/", GetThirdPartyLogos);
router.put("/third-party-logos/:id", UpdateThirdPartyLogos);

// Upload Files to Cloudinary Routes
router.post("/upload/single", upload.single("file"), UploadSingle);
router.post("/upload/multiple", upload.array("files"), UploadMultiple);

// User Documents Route
router.get("/user-documents/", Auth, GetUserDocuments);
router.post("/user-documents/", Auth, SetUserDocument);
router.put("/user-documents/:id", Auth, UpdateUserDocuments);

// Utilities - VAT Tax, Income Tax
router.post("/utility/", SetUtility);

// Video Guides Routes
router.post("/guides/", AddVideoGuide);
router.get("/guides/", GetVideoGuides);

export default router;
