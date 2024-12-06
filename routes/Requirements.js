import express from "express";
import { AddRequirements, GetRequirements } from "../controllers/Requirements.js";
const router = express.Router();

router.post('/', AddRequirements);
router.get('/', GetRequirements);

export default router;