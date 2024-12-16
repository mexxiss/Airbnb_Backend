import express from "express";
import { ChangePassword, GetUser, Login, Logout, UpdateUser } from "../../controllers/Users.js";
import { Auth } from "../../middleware/auth.js";
import { GetFilteredDates } from "../../controllers/BookedDates.js";
import { GetPaymentDetails, SetPaymentDetails, UpdatePaymentDetails } from "../../controllers/PaymentDetails.js";
import { GetAllPropertiesByUser, GetPropertyObj } from "../../controllers/Properties.js";
import { GetPropertyUtilities, SetPropertyUtility, UpdatePropertyUtility } from "../../controllers/PropertyUtilities.js";
import { GetProviders } from "../../controllers/ServiceProviders.js";
import { upload } from "../../uploads/multer.js";
import { UploadMultiple, UploadSingle } from "../../controllers/Upload.js";
import { GetUserDocuments, SetUserDocument, UpdateUserDocuments } from "../../controllers/UserDocuments.js";

const router = express.Router();

// Authentication Routes
router.post("/logout", Auth, Logout);
router.post("/change-pass", Auth, ChangePassword);
router.put("/", Auth, UpdateUser);
router.get("/", Auth, GetUser);

// Booked Dates Routes
router.get("/booked-dates/filter", GetFilteredDates);

// Payment Details Routes
router.post("/payment-details/", Auth, SetPaymentDetails);
router.get("/payment-details/", Auth, GetPaymentDetails);
router.put("/payment-details/:id", Auth, UpdatePaymentDetails);

// Properties Routes
router.get("/properties", GetAllPropertiesByUser);

// Property Utilities Routes
router.post("/property-utilities/", Auth, SetPropertyUtility);
router.get("/property-utilities/", Auth, GetPropertyUtilities);
router.put("/property-utilities/:id", Auth, UpdatePropertyUtility);

// Service Providers Routes
router.get("/providers/", GetProviders);

// Upload Files to Cloudinary Routes
router.post("/upload/single", upload.single("file"), UploadSingle);
router.post("/upload/multiple", upload.array("files"), UploadMultiple);

// User Documents Route
router.get("/user-documents/", Auth, GetUserDocuments);
router.post("/user-documents/", Auth, SetUserDocument);
router.put("/user-documents/:id", Auth, UpdateUserDocuments);



export default router;