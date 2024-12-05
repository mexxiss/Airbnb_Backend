import express from "express";
import { AddBlogCategory, GetBlogCategories } from "../controllers/BlogCategory.js";

const router = express.Router();

router.post("/", AddBlogCategory);
router.get("/", GetBlogCategories);

export default router