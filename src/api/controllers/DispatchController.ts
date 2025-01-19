import { Request, Response } from 'express';
import { DroneState } from "../Enums/DroneState";
import { LoadMedicationSchema } from "../SchemaValidation";
import { BaseResponse } from "../interfaces/BaseResponse";
import { LoadDroneRequest } from "../interfaces/LoadDroneRequest";
import DispatchService from "../services/DispatchService";
import z from 'zod';
import { LoadLogDto } from '../interfaces/LoadLogDto';


class DispatchController {

    // load drone
    public async loadDroneWithMedications(req: Request, res: Response)  {
        try {
            //drone validation
            const validateDroneLoadingObject : LoadDroneRequest = LoadMedicationSchema.parse(req.body);
            const foundDrone = await DispatchService.getDroneById(validateDroneLoadingObject.droneId);

            if(!foundDrone){
                const response: BaseResponse<null> = {
                    status: 'error',
                    data: null,
                    message: 'Drone not found',
                }
                return res.status(404).json(response);
            }

            console.info(`Drone found ${foundDrone}`)

            if(foundDrone && ![DroneState.IDLE, DroneState.LOADING].includes(foundDrone.state)){
                const response: BaseResponse<null> = {
                    status: 'error',
                    data: null,
                    message: 'Drone is not available',
                  }
                  return res.status(400).json(response);
            }

            const addedLoad = await DispatchService.loadDrone(validateDroneLoadingObject);
            const response: BaseResponse<LoadLog> = {
              status: 'success',
              data: addedLoad,
            }
            return res.status(200).json(response);
        } catch (error : any) {
            console.error(`UserController=>getAllFreeDrones ${error}`)
            if (error instanceof z.ZodError) {
                const response: BaseResponse<any> = {
                    status: 'error',
                    data: error,
                  }
                return res.status(400).json(response);
            }
            const response: BaseResponse<null> = {
              status: 'error',
              data: null,
              message: `Free drones could not be fetched, please try again: ${error?.message}`,
            }
            return res.status(500).json(response);
        }
    }

    public async fetchLoadedDroneLogs(req: Request, res: Response) {
        try {
            const loadedDroneLogs = await DispatchService.fetchLoadedDroneLogs(req.params.droneId);
            const response: BaseResponse<LoadLogDto[]> = {
              status: 'success',
              data: loadedDroneLogs,
            }
            return res.status(200).json(response);
        } catch (error) {
            console.error(`UserController=>getAllFreeDrones ${error}`)
            const response: BaseResponse<null> = {
              status: 'error',
              data: null,
              message: 'Loaded drone logs could not be fetched, please try again',
            }
            return res.status(500).json(response);
        }
    }
  
    public async updateLoadedDroneStatus(req: Request, res: Response) {
        try {
            const loadLogId = req.params.id;
            const updatedDrone = await DispatchService.updateLoadedDroneStatus(loadLogId, req.body);
            const response: BaseResponse<Drone> = {
            status: 'success',
            data: updatedDrone,
            }
            return res.status(200).json(response);
        } catch (error: any) {
            console.error(`UserController=>getDroneById ${error}`)
            const response: BaseResponse<null> = {
                status: 'error',
                data: null,
                message: `Drone could not be fetched, please try again: ${error?.message}`,
            }
            return res.status(500).json(response);
        }
    }
  
  }

  export default new DispatchController();