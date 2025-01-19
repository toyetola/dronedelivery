import { Request, Response } from 'express';
import Drone from '../models/Drone';
import DispatchService from '../services/DispatchService';

class UserController {
  // Get all users
  public async getAllFreeDrones(req: Request, res: Response) {
        try {
            console.info(`Fetching...`)
            return await DispatchService.getAllFreeDrones();
        } catch (error) {
            console.error(`UserController=>getAllFreeDrones ${error}`)
            throw new Error(`Free drones could not be fetched, please try again`)
        }
  }

  // Get user by ID
  public async getUserById(req: Request, res: Response): Promise<void> {
    try {
      
    } catch (error) {
      
    }
  }

  // Create a new user
  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      
    } catch (error) {
      
    }
  }

  // Update user
  public async updateUser(req: Request, res: Response): Promise<void> {
    try {
      
    } catch (error) {
      
    }
  }

  // Delete user
  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      
    } catch (error) {

    }
  }
}

export default new UserController();
