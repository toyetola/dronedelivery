import AdminService from '../api/services/AdminService';
import Drone from '../api/models/Drone';
import DroneRequest from '../api/interfaces/DroneRequest';
import { BatteryState } from '../api/Enums/BatteryState';
import { DroneModel } from '../api/Enums/DroneModel';
import { DroneState } from '../api/Enums/DroneState';

jest.mock('../api/models/Drone');

describe('AdminService', () => {
    describe('registerDrone', () => {
        it('should register a new drone', async () => {
            const droneRequest: DroneRequest = {
                name: 'drone1',
                droneModel: DroneModel.HEAVYWEIGHT,
                weightLimit: 500,
                batteryCapacity: 100,
                state: DroneState.LOADING,
                serialNumber: 'WERT12345'
            };

            (Drone.create as jest.Mock).mockResolvedValue(droneRequest);

            const result = await AdminService.registerDrone(droneRequest);

            expect(result).toEqual(droneRequest);
            expect(Drone.create).toHaveBeenCalledWith(droneRequest);
        });

        it('should throw an error if drone registration fails', async () => {
            const droneRequest: DroneRequest = {
                name: 'drone1',
                droneModel: DroneModel.CRUISEWEIGHT,
                weightLimit: 500,
                batteryCapacity: 100,
                state: DroneState.LOADING,
                serialNumber: 'WERT12345'
            };

            (Drone.create as jest.Mock).mockRejectedValue(new Error('Registration failed'));

            await expect(AdminService.registerDrone(droneRequest)).rejects.toThrow('The drone could not be registered, please try again');
        });
    });

    describe('chargeDrone', () => {
        it('should set the drone battery status to CHARGING', async () => {
            const drone = {
                id: 'drone1',
                batteryStatus: BatteryState.NOTCHARGING,
                startChargeTime: null,
                save: jest.fn().mockResolvedValue(true)
            };

            (Drone.findById as jest.Mock).mockResolvedValue(drone);

            const result = await AdminService.chargeDrone('drone1');

            expect(result.batteryStatus).toBe(BatteryState.CHARGING);
            expect(result.startChargeTime).toBeInstanceOf(Date);
            expect(drone.save).toHaveBeenCalled();
        });

        it('should throw an error if drone is not found', async () => {
            (Drone.findById as jest.Mock).mockResolvedValue(null);

            await expect(AdminService.chargeDrone('drone1')).rejects.toThrow('Drone not found');
        });

        it('should throw an error if charging fails', async () => {
            (Drone.findById as jest.Mock).mockRejectedValue(new Error('Charging failed'));

            await expect(AdminService.chargeDrone('drone1')).rejects.toThrow('Charging failed');
        });
    });
});