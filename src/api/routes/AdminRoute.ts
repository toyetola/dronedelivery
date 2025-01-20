import { Router } from 'express';
import AdminController from '../controllers/AdminController';

const router = Router();

//Routes
router.post('/drone/register', AdminController.registerDrone);
router.get('/drone/:droneId/charge', AdminController.chargeDrone);

export default router;