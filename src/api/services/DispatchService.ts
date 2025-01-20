import { BatteryState } from "../Enums/BatteryState";
import { DroneState } from "../Enums/DroneState";
import { LoadDroneRequest } from "../interfaces/LoadDroneRequest";
import { Medication } from "../interfaces/Medication";
import Drone from "../models/Drone";
import LoadLog from "../models/LoadLog";


class DispatchService {

    getAllFreeDrones = async () => {
        try {
            const availableDrones =  await Drone.find({state : {$in : [DroneState.IDLE] }});
            console.info(`Drones free ${availableDrones}`)
            return availableDrones;
        } catch (error) {
            console.error(`DispatchService=>getAllFreeDrones ${error}`)
            throw new Error(`Error getting drones try again`)
        }
        
    }

    getDroneById = async (id: string) => {
        try {
            const drone = await Drone.findById(id);
            return drone;
        } catch (error) {
            console.error(`DispatchService=>getDroneById ${error}`)
            throw new Error(`Error getting drone by id try again`)
        }
    }

    loadDrone = async (loadDroneRequest : LoadDroneRequest) => {
        try {
            const drone = await Drone.findById(loadDroneRequest.droneId);

            let loadLog = await LoadLog.findOne({droneId : loadDroneRequest.droneId, status : DroneState.LOADING});

            if(drone && loadLog){

                const currentTotalWeight = loadLog.medications.reduce((accumulator, currentObject) => {
                    return accumulator + currentObject.weight;
                }, 0);

                if(drone?.weightLimit < loadDroneRequest.medication.weight + currentTotalWeight){
                    throw new Error(`Drone weight limit exceeded`)
                }

                
                loadLog.medications.push(loadDroneRequest.medication);
                loadLog.status = DroneState.LOADING;
                loadLog = await loadLog.save();
                drone.state = DroneState.LOADING;
                await drone.save();
                return loadLog;
            }else if(drone && !loadLog){
                
                interface LoadLogInterface extends LoadDroneRequest {
                    medications: Medication[]
                }
                const loadDroneRequestWithMedications : LoadLogInterface = {
                    ...loadDroneRequest,
                    medications : [loadDroneRequest.medication],
                    status : DroneState.LOADING
                }
                const medicationLoaded = await LoadLog.create(loadDroneRequestWithMedications)
                drone.state = DroneState.LOADING;
                await drone.save();
                return medicationLoaded;
            }

            return null;
        } catch (error:any) {
            console.error(`DispatchService=>loadDrone ${error}`)
            throw new Error(`${error.message}`)
        }
    }

    fetchLoadedDroneLogs = async (droneId: string) => {
        try {
            const loadedDroneLogs = await LoadLog.find({droneId});
            return loadedDroneLogs;
        } catch (error:any) {
            console.error(`DispatchService=>fetchLoadedDroneLogs ${error}`)
            throw new Error(`${error.message}`)
        }
    }

    updateLoadedDroneStatus = async (loadLogId: string, updateRequestBody: any) => {
        try {
            const loadLog = await LoadLog.findById(loadLogId);
            if(!loadLog){
                throw new Error(`Load log not found`)
            }
            
            if(updateRequestBody.status === DroneState.DELIVERED){
                if(loadLog.status !== DroneState.DELIVERING){
                    throw new Error(`Drone not loaded: drone has to be delivering`)
                }
            }else if(updateRequestBody.status === DroneState.RETURNING){
                if(loadLog.status !== DroneState.DELIVERED){
                    throw new Error(`Drone items not delivered yet`)
                }
            }else if(updateRequestBody.status === DroneState.LOADED){
                if(loadLog.status !== DroneState.LOADING){
                    throw new Error(`Drone has to be in lading state`)
                }
            }else if(updateRequestBody.status === DroneState.IDLE){
                if(![DroneState.RETURNING, DroneState.OFFLOADED].includes(loadLog.status)){
                    throw new Error(`Drone not returning or offloaded`)
                }
            }
            
            loadLog.status = updateRequestBody.status;
            await loadLog.save();
            if(updateRequestBody.status === DroneState.LOADED) {
                Drone.updateOne({ _id: loadLog.droneId }, { state: updateRequestBody.status, lastTimeOfTakeOff: Date.now, batteryStatus : BatteryState.NOTCHARGING }).exec();
            }else{
                Drone.updateOne({ _id: loadLog.droneId }, { state: updateRequestBody.status }).exec();
            }
            
            return loadLog;
            
        } catch (error: any) {
            console.error(`DispatchService=>updateLoadedDroneStatus ${error}`)
            throw new Error(`${error.message}`)
        }
    }

    checkDroneBatteryLevel = async (droneId: string) => {
        
        try {
            const drone = await Drone.findById(droneId);
            return drone?.batteryCapacity;
        } catch (error: any) {
            console.error(`DispatchService=>checkDroneBatteryLevel ${error}`)
            throw new Error(`${error.message}`)
        }
        
    }
}

export default new DispatchService();