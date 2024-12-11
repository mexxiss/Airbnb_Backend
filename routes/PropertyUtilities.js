import express from "express";
import { GetPropertyUtilities, SetPropertyUtility, UpdatePropertyUtility } from "../controllers/PropertyUtilities.js";
const router = express.Router();

router.post('/', SetPropertyUtility);
router.get('/', GetPropertyUtilities);
router.put('/:id', UpdatePropertyUtility);

export default router;