import express from "express";
import { AddBlogs, GetBlogs } from "../controllers/Blogs.js";

const router = express.Router();

router.post("/", AddBlogs);
router.get("/", GetBlogs);

export default router