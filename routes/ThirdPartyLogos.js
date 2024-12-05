import express from "express";
import { AddThirdPartyLogos, GetThirdPartyLogos, UpdateThirdPartyLogos } from "../controllers/ThirdPartyLogos.js";

const router = express.Router();

router.post("/", AddThirdPartyLogos);
router.get("/", GetThirdPartyLogos);
router.put("/:id", UpdateThirdPartyLogos);

export default router