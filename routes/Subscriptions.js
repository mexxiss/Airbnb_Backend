import express from "express";
import { DeleteSubscription, GetSubscriptions, SetSubscription } from "../controllers/Subscriptions.js";
const router = express.Router();

router.post('/', SetSubscription);
router.get('/', GetSubscriptions);
router.delete('/:id', DeleteSubscription);

export default router