import express from "express";
import { SetProperty, DeleteProperty, GetAllProperties, UpdateProperty, GetPropertyObj } from "../controllers/Properties.js";
import { Auth } from "../middleware/auth.js";
const router = express.Router();

router.get('/', Auth, GetAllProperties);
router.get('/:id', GetPropertyObj);
router.post('/', SetProperty);
router.delete('/:id', DeleteProperty)
router.put('/:id', UpdateProperty);

export default router;