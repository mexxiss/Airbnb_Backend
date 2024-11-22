import express from "express";
import { DeleteFaq, GetFaqs, GetFilteredFaqs, SetFaqs, UpdateFaq } from "../controllers/Faq.js";

const router = express.Router();

router.get('/', GetFaqs);
router.post('/', SetFaqs);
router.delete('/:id', DeleteFaq);
router.put('/:id', UpdateFaq);

export default router;