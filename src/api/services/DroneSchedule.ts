import Drone from '../models/Drone';
import dayjs from 'dayjs';
import { config } from '../../config'
import BatteryUsageLog from '../models/BatteryUsageLog';


export const checkDroneBatteryLevels = async () => {
    try {
        const drones = await Drone.find();
        drones.forEach(drone => {
            console.log(`Drone ID: ${drone.id}, Battery Level: ${drone?.batteryCapacity}%`);
            
            const lastCheckedTime = dayjs(drone.lastTimeOfTakeOff);
            const currentTime = dayjs();
            
            //assuming battery drains during/after usage
            if (lastCheckedTime){
                const diff = currentTime.diff(lastCheckedTime, 'minutes');
                console.log(`Minutes since last checked: ${diff}`);
                
                const dropRate = config.batteryDropRate;
                const dropInterval = config.batteryDropTime

                //i.e. battery 2% every 15 minutes

                const drop = (diff / dropInterval) * dropRate;
                
                let newBatteryLevel;
                drop > 1 ? newBatteryLevel = drone.batteryCapacity - drop : newBatteryLevel = 0;
                

                drone.batteryCapacity = newBatteryLevel;
                drone.save();

                // Log the battery level in document db
                BatteryUsageLog.create({droneId: drone.id, batteryLevel: newBatteryLevel});

                console.info(`Drone ID: ${drone.id}, Battery Level: ${drone?.batteryCapacity}%`); // this can also be exported to serve as logs of the battery levels
            }

            //create audit log in document db
            BatteryUsageLog.create({droneId: drone.id, batteryLevel: drone?.batteryCapacity});
            
            console.log(`Drone ID: ${drone.id}, Battery Level remains same: ${drone?.batteryCapacity}%`);

        });
    } catch (error : any) {
        console.error(`Error checking drone battery levels: ${error.message}`);
    }
}