import express from "express";
import { GetServices, SetService } from "../controllers/Services.js";
const router = express.Router();

router.post('/add-service', SetService);
router.get('/', GetServices);

export default router