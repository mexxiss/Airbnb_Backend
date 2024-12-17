import express from 'express';
import userRoutes from './Users/users.route.js';
import adminRoutes from './Admin/admin.route.js';
import otherRoutes from './others/others.route.js';

const router = express.Router();

router.use('/users', userRoutes); 
router.use('/admin', adminRoutes); 
router.use('/', otherRoutes);  

export default router;
