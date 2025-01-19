import { DroneModel } from "../Enums/DroneModel";
import { DroneState } from "../Enums/DroneState";

interface DroneRequest {
    name : string,
    model: DroneModel,
    weightLimit : number,
    batteryCapacity : number,
    state?: DroneState,
    serialNumber: string
}

export default DroneRequest;