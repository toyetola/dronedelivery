import { Router } from 'express';
import UserController from '../controllers/UserController';
import DispatchController from '../controllers/DispatchController';

const router = Router();

// Define routes
router.get('/drones', UserController.getAllFreeDrones);
router.get('/drone/:id', UserController.getDroneById);
router.post('/drone/load', DispatchController.loadDroneWithMedications);
router.get('/drone/:droneId/logs/', DispatchController.fetchLoadedDroneLogs);
router.put('/loadLog/status/update/:id', DispatchController.updateLoadedDroneStatus);
router.get('/drone/:droneId/battery/check', DispatchController.checkDroneBatteryLevel)

export default router;