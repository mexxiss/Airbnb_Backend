import express from "express";
import { GetProviders, SetProviders } from "../controllers/ServiceProviders.js";
const router = express.Router();

router.post('/', SetProviders);
router.get('/', GetProviders);

export default router;