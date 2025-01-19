import Drone from "../models/Drone";


class DispatchService {

    getAllFreeDrones = async () => {
        try {
            const availableDrones =  await Drone.find({state : {$in : ['IDLE', 'RETURNING'] }});
            console.info(`Drones free ${availableDrones}`)
            return availableDrones;
        } catch (error) {
            console.error(`DispatchService=>getAllFreeDrones ${error}`)
            throw new Error(`Error getting drones try again`)
        }
        
    }
}

export default new DispatchService();