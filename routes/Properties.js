import express from "express";
import { SetProperty, DeleteProperty, GetAllProperties, UpdateProperty } from "../controllers/Properties.js";
const router = express.Router();

router.get('/', GetAllProperties);
router.post('/', SetProperty);
router.delete('/:id', DeleteProperty)
router.put('/:id', UpdateProperty);

export default router;