import express from "express";
import { Auth } from "../../middleware/auth.js";
import {
  ChangePassword,
  GetUser,
  Logout,
  UpdateUser,
} from "../../controllers/common/users/users.controllers.js";
import { GetFilteredDates } from "../../controllers/common/booking/dates.controllers.js";
import {
  GetPaymentDetails,
  SetPaymentDetails,
  UpdatePaymentDetails,
} from "../../controllers/common/users/bankdetails.controllers.js";
import {
  GetAllPropertiesByUser,
  GetFullPropertiesObjByUser,
  SetBlockOwnerStay,
} from "../../controllers/common/properties/properties.controllers.js";
import {
  GetPropertyUtilities,
  SetPropertyUtility,
  UpdatePropertyUtility,
} from "../../controllers/common/properties/utilities.controllers.js";
import { GetProviders } from "../../controllers/common/providers/providers.controllers.js";

import { upload } from "../../uploads/multer.js";
import {
  UploadMultiple,
  UploadSingle,
} from "../../controllers/common/upload/upload.controllers.js";
import {
  GetUserDocuments,
  SetUserDocument,
  UpdateUserDocuments,
} from "../../controllers/common/users/documents.controllers.js";
import {
  createPropertyUtility,
  deletePropertyUtilityById,
  getPropertyUtilityById,
  UpdatePropertyUtilityById,
} from "../../controllers/common/properties/utilitiesmanager.controllers.js";
import { SetBlockedDates } from "../../controllers/general/booking/date.owner-block.controllers.js";
import { addQuery } from "../../controllers/common/users/userqueries.controllers.js";


const router = express.Router();

// Authentication Routes
router.post("/logout", Logout);
router.post("/change-pass", ChangePassword);
router.put("/", UpdateUser);
router.get("/", GetUser);

// Booked Dates Routes
router.get("/booked-dates/filter", GetFilteredDates);

// Payment Details Routes
router.post("/payment-details/", SetPaymentDetails);
router.get("/payment-details/", GetPaymentDetails);
router.put("/payment-details/:id", UpdatePaymentDetails);

// Properties Routes
router.get("/properties", GetAllPropertiesByUser);
router.get("/properties/all", GetFullPropertiesObjByUser);
router.get("/properties/block-owner/:id", SetBlockOwnerStay);

// Property Utilities Routes
router.post("/property-utilities/", SetPropertyUtility);
router.get("/property-utilities/", GetPropertyUtilities);
router.put("/property-utilities/:id", UpdatePropertyUtility);

// Property Utilities Manager Routes
router.post("/utilities/", createPropertyUtility);
router.get("/utilities", getPropertyUtilityById);
router.put("/utilities/:id", UpdatePropertyUtilityById);
router.delete("/utilities/:id", deletePropertyUtilityById);

// Service Providers Routes
router.get("/providers/", GetProviders);

// Upload Files to Cloudinary Routes
router.post("/upload/single", upload.single("file"), UploadSingle);
router.post("/upload/multiple", upload.array("files"), UploadMultiple);

// User Documents Route
router.get("/user-documents/", GetUserDocuments);
router.post("/user-documents/", SetUserDocument);
router.put("/user-documents/:id", UpdateUserDocuments);


router.post("/blocked-owner-dates/", SetBlockedDates);

// Users Queries Routes
router.post("/queries", addQuery);

export default router;

