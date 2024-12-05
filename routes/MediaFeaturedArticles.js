import express from "express";
import { AddFeaturedArticles, GetFeaturedArticles } from "../controllers/MediaFeaturedArticles.js";

const router = express.Router();

router.post("/", AddFeaturedArticles);
router.get("/", GetFeaturedArticles);

export default router