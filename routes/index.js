import express from 'express';
import userRoutes from './Users/users.route.js';
import adminRoutes from './Admin/admin.route.js';
import otherRoutes from './others/others.route.js';
import { Auth } from '../middleware/auth.js';
import { Role } from '../utils/validations/roleValidator.js';

const router = express.Router();

router.use('/users', Auth, userRoutes); 
router.use('/admin', Auth, Role(["Admin"]),  adminRoutes); 
router.use('/', otherRoutes);  

export default router;
