import express from "express";
import { GetHomeContent, SetHomeContent, UpdateHomeContent } from "../controllers/HomeContent.js";
import { upload } from "../uploads/multer.js";
const router = express.Router();

router.get('/', GetHomeContent);
router.post('/', SetHomeContent);
router.put('/:id', UpdateHomeContent);

export default router;