import express from "express";
import { GetTestimonials, SetTestimonials } from "../controllers/Testimonials.js";
const router = express.Router();

router.post('/', SetTestimonials);
router.get('/', GetTestimonials)

export default router