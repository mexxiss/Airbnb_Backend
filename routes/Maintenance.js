import express from "express";
import { AddMaintenance } from "../controllers/Maintenance.js";
const router = express.Router();

router.post('/', AddMaintenance)

export default router;