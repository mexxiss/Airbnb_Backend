import express from "express";
import { AddVideoGuide, GetVideoGuides } from "../controllers/VideoGuides.js";

const router = express.Router();

router.post("/", AddVideoGuide);
router.get("/", GetVideoGuides);

export default router