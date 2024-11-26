import express from "express";
import { SetProperty, DeleteProperty, GetAllProperties, UpdateProperty, GetPropertyObj } from "../controllers/Properties.js";
const router = express.Router();

router.get('/', GetAllProperties);
router.get('/:id', GetPropertyObj);
router.post('/', SetProperty);
router.delete('/:id', DeleteProperty)
router.put('/:id', UpdateProperty);

export default router;