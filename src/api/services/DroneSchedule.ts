import Drone from '../models/Drone';
import dayjs from 'dayjs';
import { config } from '../../config'
import BatteryUsageLog from '../models/BatteryUsageLog';
import { BatteryState } from '../Enums/BatteryState';


export const checkDroneBatteryLevels = async () => {
    try {
        const drones = await Drone.find();
        drones.forEach(drone => {
            console.log(`Drone ID: ${drone.id}, Battery Level: ${drone?.batteryCapacity}%`);
            
            const lastCheckedTime = dayjs(drone.lastTimeOfTakeOff);
            const currentTime = dayjs();
            
            //assuming battery drains during/after usage
            if (lastCheckedTime){
                let diff = currentTime.diff(lastCheckedTime, 'minutes');
                console.log(`Minutes since last checked: ${diff}`);
                
                const dropRate = config.batteryDropRate;
                const dropInterval = config.batteryDropTime

                let newBatteryLevel = 0;

                //i.e. battery 2% every 15 minutes

                if(drone.batteryStatus === BatteryState.NOTCHARGING){

                    const drop = (diff / dropInterval) * dropRate;
                
                
                    drop > 1 ? newBatteryLevel = drone.batteryCapacity - drop : newBatteryLevel = 0;
                    drone.batteryCapacity = newBatteryLevel;
                } else if(drone.batteryStatus === BatteryState.CHARGING){
                    const gainRate = config.batteryGainRate;
                    const gainInterval = config.batteryGainTime;

                    diff = currentTime.diff(drone.startChargeTime, 'minutes');

                    const gain = (diff / gainInterval) * gainRate;
                    drone.batteryCapacity + gain > 100 ? newBatteryLevel = 100 :  newBatteryLevel = drone.batteryCapacity + gain;
                    if(newBatteryLevel === 100){
                        drone.batteryStatus = BatteryState.NOTCHARGING;
                    }
                }

                drone.batteryCapacity = newBatteryLevel;
                

                drone.save();

                // Log the battery level in document db
                BatteryUsageLog.create({droneId: drone.id, batteryLevel: newBatteryLevel});

                console.info(`Drone ID: ${drone.id}, Battery Level: ${drone?.batteryCapacity}%`); // this can also be exported to serve as logs of the battery levels
            }else{

                if(drone.batteryStatus === BatteryState.CHARGING){
                    const gainRate = config.batteryGainRate;
                    const gainInterval = config.batteryGainTime;

                    let newBatteryLevel = 0;

                    const diff = currentTime.diff(drone.startChargeTime, 'minutes');

                    const gain = (diff / gainInterval) * gainRate;
                    drone.batteryCapacity + gain > 100 ? newBatteryLevel = 100 :  newBatteryLevel = drone.batteryCapacity + gain;

                    drone.batteryCapacity = newBatteryLevel;
                    drone.save();
                }

                

                //create audit log in document db
                BatteryUsageLog.create({droneId: drone.id, batteryLevel: drone?.batteryCapacity});

                console.log(`Drone ID: ${drone.id}, Battery Level remains same: ${drone?.batteryCapacity}%`);
            }

            

        });
    } catch (error : any) {
        console.error(`Error checking drone battery levels: ${error.message}`);
    }
}