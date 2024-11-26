import express from "express";
import {
  createContactus,
  getContactus,
  sendContactQuery,
  updateContactUs,
} from "../controllers/ContactUs.js";
import {
  contactValidator,
  contactQuerySendValidator,
} from "../utils/validations/contactvalidator.js";
const router = express.Router();

router.post("/", contactValidator, createContactus);
router.post("/query", contactQuerySendValidator, sendContactQuery);
router.get("/", getContactus);
router.put("/:id", updateContactUs);

export default router;
