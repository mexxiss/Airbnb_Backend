import express from "express";
import { AddPricing, DeletePricing, GetPricings, UpdatePricing } from "../controllers/Pricing.js";
const router = express.Router();

router.post('/', AddPricing)
router.get('/', GetPricings)
router.put('/:id', UpdatePricing)
router.delete('/:id', DeletePricing)

export default router;