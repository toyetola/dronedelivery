import { z } from 'zod'
import { DroneModel } from '../Enums/DroneModel'
import { DroneState } from "../Enums/DroneState"

export const DroneRegistrationSchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
    model: z.enum([DroneModel.CRUISEWEIGHT, DroneModel.HEAVYWEIGHT, DroneModel.LIGTHWEIGHT, DroneModel.MIDDLEWEIGHT]),
    weightLimit: z.number().positive().max(500), // in grams,
    batteryCapacity:  z.number().min(0).max(100),
    state: z.enum([DroneState.IDLE, DroneState.LOADED, DroneState.LOADING, DroneState.DELIVERING, DroneState.DELIVERED, DroneState.RETURNING]).optional(),
    serialNumber: z.string().max(100, { message: 'Serial Number cannot exceed 100 characters' })
});