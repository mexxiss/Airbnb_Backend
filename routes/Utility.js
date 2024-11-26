import express from "express";
import { SetUtility } from "../controllers/Utility.js";
const router = express.Router();

router.post('/', SetUtility)

export default router;