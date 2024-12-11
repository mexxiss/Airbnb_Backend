import express from "express";
import { GetPropertyUtilities, SetPropertyUtility, UpdatePropertyUtility } from "../controllers/PropertyUtilities.js";
import { Auth } from "../middleware/auth.js";
const router = express.Router();

router.post('/', Auth, SetPropertyUtility);
router.get('/', Auth, GetPropertyUtilities);
router.put('/:id', Auth, UpdatePropertyUtility);

export default router;