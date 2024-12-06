import express from "express";
import { AddBlogs, GetBlog, GetBlogs } from "../controllers/Blogs.js";

const router = express.Router();

router.post("/", AddBlogs);
router.get("/", GetBlogs);
router.get("/:id", GetBlog);

export default router