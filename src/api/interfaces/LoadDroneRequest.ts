import { Medication } from "./Medication";

export interface LoadDroneRequest {
    droneId: string;
    medication: Medication;
    location?: string | null;
    status?: string | null;
}