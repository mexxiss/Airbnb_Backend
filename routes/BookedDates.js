import express from "express";
import { DeleteBookedDates, GetBookedDates, GetFilteredDates, SetBookedDates, UpdateBookedDates } from "../controllers/BookedDates.js";
const router = express.Router();

router.get('/', GetBookedDates);
router.post('/', SetBookedDates);
router.get('/filter', GetFilteredDates);
router.put('/:id', UpdateBookedDates);
router.delete('/:id', DeleteBookedDates);

export default router;