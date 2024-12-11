import express from "express";
import { AddRevenueDetails, GetAreas } from "../controllers/EstimateRevenue.js";
const router = express.Router();

router.post('/', AddRevenueDetails)
router.get('/', GetAreas);

export default router