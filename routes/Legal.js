import express from "express";
import { AddLegal, GetLegals } from "../controllers/Legal.js";
const router = express.Router();

router.post('/', AddLegal)
router.get('/', GetLegals)

export default router;