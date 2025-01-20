import DroneRequest from "../interfaces/DroneRequest";
import Drone from "../models/Drone";
import { DroneDto } from "../interfaces/DroneDto"
import { BaseResponse } from "../interfaces/BaseResponse";
import { BatteryState } from "../Enums/BatteryState";



class AdminService {
    
    registerDrone = async (drone : DroneRequest) => {
        try {
            return await Drone.create(drone);
        } catch (error) {
            console.error(`AdminService=>registerDrone ${error}`)
            throw new Error(`The drone could not be registered, please try again`)
        }
    }

    chargeDrone = async (droneId : string) => {
        try {
            const drone = await Drone.findById(droneId);
            if(drone){
                drone.batteryStatus = BatteryState.CHARGING;
                drone.startChargeTime = new Date();
                await drone.save();
                return drone;
            }else{
                throw new Error(`Drone not found`)
            }
        } catch (error: any) {
            console.error(`AdminService=>chargeDrone ${error}`)
            throw new Error(`${error.message}`)
        }
    }
}

export default new AdminService();