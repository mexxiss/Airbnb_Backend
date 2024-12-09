import express from "express";
import { GetDubaiDetails, SetDubaiDetails } from "../controllers/Dubai.js";

const router = express.Router();

router.post("/", SetDubaiDetails);
router.get("/", GetDubaiDetails);

export default router