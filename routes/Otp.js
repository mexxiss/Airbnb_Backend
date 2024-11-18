import express from "express";
import { deleteOtps, getOtps, SendOtp, VerifyOtp } from "../controllers/Otp.js";
const router = express.Router();

router.get('/', getOtps)
router.delete('/delete-otp', deleteOtps)
router.post('/send-otp', SendOtp)
router.post('/verify-otp', VerifyOtp)

export default router;