import express from "express";
import { Auth } from "../middleware/auth.js";
import { SetPassReset, SetNewPassword } from "../controllers/PassReset.js";
const router = express.Router();

router.post('/generate-reset-token', SetPassReset);
router.post('/change-password', Auth, SetNewPassword);

export default router;