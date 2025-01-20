import { Request, Response } from 'express';
import DispatchService from '../services/DispatchService';
import { BaseResponse } from '../interfaces/BaseResponse';
import { DroneDto } from '../interfaces/DroneDto';

class UserController {

  // Get all users<BaseResponse<Drone[]>>
  public async getAllFreeDrones(req: Request, res: Response) : Promise<any>  {
      try {
          console.info(`Fetching...`)
          const drones =  await DispatchService.getAllFreeDrones();
          const response: BaseResponse<DroneDto[]> = {
            status: 'success',
            data: drones,
          }
          return res.status(200).json(response);
      } catch (error) {
          console.error(`UserController=>getAllFreeDrones ${error}`)
          const response: BaseResponse<null> = {
            status: 'error',
            data: null,
            message: 'Free drones could not be fetched, please try again',
          }
          return res.status(500).json(response);
      }
  }

  // Get drone by ID
  public async getDroneById(req: Request, res: Response) : Promise<any> {
    try {
      const drone = await DispatchService.getDroneById(req.params.id);
      const response: BaseResponse<DroneDto | null> = {
        status: 'success',
        data: drone,
      }
      return res.status(200).json(response);
    } catch (error) {
      console.error(`UserController=>getDroneById ${error}`)
      const response: BaseResponse<null> = {
        status: 'error',
        data: null,
        message: 'Drone could not be fetched, please try again',
      }
      return res.status(500).json(response);
    }
  }

}

export default new UserController();
