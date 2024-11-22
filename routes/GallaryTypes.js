import express from "express";
import { DeleteGallaryType, GetGallaryTypes, SetGallaryType } from "../controllers/GallaryTypes.js";
const router = express.Router();

router.get('/', GetGallaryTypes);
router.post('/', SetGallaryType);
router.delete('/:id', DeleteGallaryType);

export default router