import express from "express";
import { AddVideoGuide } from "../controllers/VideoGuides.js";

const router = express.Router();

router.post("/", AddVideoGuide)

export default router