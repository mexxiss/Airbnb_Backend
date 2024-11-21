import express from "express";
import {
  createGalleryContent,
  getGalleryImagesByQuery,
} from "../controllers/Gallery.js";
import galleryValidator from "../utils/validations/galleryValidator.js";

const router = express.Router();

router.post("/", galleryValidator, createGalleryContent);
router.get("/", getGalleryImagesByQuery);

export default router;
