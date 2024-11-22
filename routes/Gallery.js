import express from "express";
import {
  createGalleryContent,
  getGalleryImagesByQuery,
  UpdateGallary,
} from "../controllers/Gallery.js";
import galleryValidator from "../utils/validations/galleryValidator.js";

const router = express.Router();

router.post("/", galleryValidator, createGalleryContent);
router.get("/", getGalleryImagesByQuery);
router.put("/:id", UpdateGallary);

export default router;
