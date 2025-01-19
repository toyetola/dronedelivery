import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();

// Define routes
router.get('/drones', UserController.getAllFreeDrones);

export default router;