import { Request, Response} from 'express'
import DroneRequest from '../interfaces/DroneRequest';
import { DroneRegistrationSchema } from '../SchemaValidation'
import AdminService from '../services/AdminService';
import { z } from 'zod'

class AdminController {


    registerDrone  = async (req: Request, res: Response) => {

        try {
            const validatedDroneObject : DroneRequest = DroneRegistrationSchema.parse(req.body)
            const registeredDrone = await AdminService.registerDrone(validatedDroneObject)
            return res.status(201).json(registeredDrone);
        } catch (error) {
            console.error(`Error registering device ${error}`)
            if (error instanceof z.ZodError) {
                
                console.error(`Validation errors:, ${JSON.stringify(error.errors)}`);
                return res.status(400).json({errors: error.errors});
            }
            console.error(`AdminConroller => regisrDrone ${error}`)
            throw new Error(`Cannot register drone`)
        }
    }

    chargeDrone = async (req: Request, res: Response) => {
        try {
            const droneId = req.params.droneId
            const chargingDrone = await AdminService.chargeDrone(droneId)
            return res.status(200).json(chargingDrone)
        } catch (error) {
            console.error(`AdminController => chargeDrone ${error}`)
            throw new Error(`Cannot charge drone`)
        }
    }
}

export default new AdminController();