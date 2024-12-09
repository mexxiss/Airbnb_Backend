import express from "express";
import { GetPaymentDetails, SetPaymentDetails, UpdatePaymentDetails } from "../controllers/PaymentDetails.js";
import { Auth } from "../middleware/auth.js";
const router = express.Router();

router.post('/', Auth, SetPaymentDetails)
router.get('/', Auth, GetPaymentDetails)
router.put('/:id', Auth, UpdatePaymentDetails)

export default router;