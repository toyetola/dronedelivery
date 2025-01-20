import { DroneModel } from "../Enums/DroneModel";
import { DroneState } from "../Enums/DroneState";

interface DroneRequest {
    name : string,
    droneModel: DroneModel,
    weightLimit : number,
    batteryCapacity : number,
    state?: DroneState,
    serialNumber: string
}

export default DroneRequest;