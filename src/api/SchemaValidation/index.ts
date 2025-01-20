import { z } from 'zod'
import { DroneModel } from '../Enums/DroneModel'
import { DroneState } from "../Enums/DroneState"

export const DroneRegistrationSchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
    droneModel: z.enum([DroneModel.CRUISEWEIGHT, DroneModel.HEAVYWEIGHT, DroneModel.LIGTHWEIGHT, DroneModel.MIDDLEWEIGHT]),
    weightLimit: z.number().positive().max(500), // in grams,
    batteryCapacity:  z.number().min(0).max(100),
    state: z.enum([DroneState.IDLE, DroneState.LOADED, DroneState.LOADING, DroneState.DELIVERING, DroneState.DELIVERED, DroneState.RETURNING]).optional(),
    serialNumber: z.string().max(100, { message: 'Serial Number cannot exceed 100 characters' })
});

export const LoadMedicationSchema = z.object({
    droneId: z.string().min(1, { message: 'Drone ID cannot be empty' }),
    medication: z.object({
        name: z.string().min(1, { message: 'Medication name cannot be empty' }),
        weight: z.number().positive().min(1, { message: 'Weight cannot be less than 1' }),
        code: z.string().regex(/^[A-Z0-9_]+$/, {
            message: "Code must contain only uppercase letters, underscores, and numbers",
        }),
        imageUrl: z.string().max(500, { message: 'Battery capacity cannot exceed 500' }).url()
    }),
    location: z.string().max(100, { message: 'Location cannot exceed 100 characters' }).optional()
})