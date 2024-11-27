import express from "express";
import { AddRevenueDetails } from "../controllers/EstimateRevenue.js";
const router = express.Router();

router.post('/', AddRevenueDetails)

export default router