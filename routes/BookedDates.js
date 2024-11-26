import express from "express";
import { GetBookedDates, SetBookedDates } from "../controllers/BookedDates.js";
const router = express.Router();

router.get('/', GetBookedDates);
router.post('/', SetBookedDates);

export default router;