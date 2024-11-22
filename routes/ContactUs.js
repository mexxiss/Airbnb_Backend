import express from "express";
import {
  createContactus,
  getContactus,
  sendContactQuery,
} from "../controllers/ContactUs.js";
import {
  contactValidator,
  contactQuerySendValidator,
} from "../utils/validations/contactvalidator.js";
const router = express.Router();

router.post("/", contactValidator, createContactus);
router.post("/query", contactQuerySendValidator, sendContactQuery);
router.get("/", getContactus);

export default router;
