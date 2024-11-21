import express from "express";
import {
  createAmenities,
  getAllAmenities,
  getAmenitiesById,
  updateAmenities,
  deleteAmenities,
} from "../controllers/Amenities.js";
import amenitiesValidator from "../utils/validations/amenitiesValidatior.js";

const router = express.Router();

router.post("/", amenitiesValidator, createAmenities);
router.get("/", getAllAmenities);
router.delete("/:id", deleteAmenities);
router.put("/:id", updateAmenities);
router.get("/:id", getAmenitiesById);

export default router;
