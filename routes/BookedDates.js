import express from "express";
import { GetBookedDates, GetFilteredDates, SetBookedDates } from "../controllers/BookedDates.js";
const router = express.Router();

router.get('/', GetBookedDates);
router.post('/', SetBookedDates);
router.get('/filter', GetFilteredDates);

export default router;