import express from "express";
import { Auth } from "../middleware/auth.js";
import { GetUserDocuments, SetUserDocument } from "../controllers/UserDocuments.js";

const router = express.Router();

router.get('/', Auth, GetUserDocuments);
router.post('/', Auth, SetUserDocument);

export default router