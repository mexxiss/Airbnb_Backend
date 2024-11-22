import express from "express";
import { GetGallaryTypes, SetGallaryType } from "../controllers/GallaryTypes.js";
const router = express.Router();

router.get('/', GetGallaryTypes);
router.post('/', SetGallaryType);

export default router