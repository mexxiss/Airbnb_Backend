import express from "express";
import { createContactus, getContactus } from "../controllers/ContactUs.js";
import contactValidator from "../utils/validations/contactvalidator.js";
const router = express.Router();

router.post("/", contactValidator, createContactus);
router.get("/", getContactus);

export default router;
