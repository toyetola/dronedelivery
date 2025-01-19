import { Router } from 'express';
import UserController from '../controllers/UserController';
import AdminController from '../controllers/AdminController';

const router = Router();

//Routes
router.post('/drone/register', AdminController.registerDrone);

export default router;