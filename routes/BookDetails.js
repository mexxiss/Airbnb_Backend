import express from "express";
import { GetBookDetails, SetBookDetails } from "../controllers/BookDetails.js";
const router = express.Router();

router.get('/:id', GetBookDetails)
router.post('/', SetBookDetails)

export default router;