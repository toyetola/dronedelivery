import DroneRequest from "../interfaces/DroneRequest";
import Drone from "../models/Drone";
import { DroneDto } from "../interfaces/DroneDto"
import { BaseResponse } from "../interfaces/BaseResponse";



class AdminService {
    
    registerDrone = async (drone : DroneRequest) => {
        try {
            return await Drone.create(drone);
        } catch (error) {
            console.error(`AdminService=>registerDrone ${error}`)
            throw new Error(`The drone could not be registered, please try again`)
        }
    }
}

export default new AdminService();