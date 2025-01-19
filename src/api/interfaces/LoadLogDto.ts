import { DroneState } from "../Enums/DroneState";
import { Medication } from "./Medication";

export interface LoadLogDto {
    droneId?: any;
    medications: Array<Medication>;
    status: any;
    createdAt: any;
    updatedAt: any;
    id?: any | null;
    __v: any | null;
    _id: any;
}