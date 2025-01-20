import DispatchService from '../api/services//DispatchService';
import Drone from '../api/models/Drone';
import LoadLog from '../api/models/LoadLog';
import { DroneState } from '../api/Enums/DroneState';
import { LoadDroneRequest } from '../api/interfaces/LoadDroneRequest';
import { Medication } from '../api/interfaces/Medication';

jest.mock('../api/models/Drone');
jest.mock('../api/models/LoadLog');

describe('DispatchService', () => {
    describe('getAllFreeDrones', () => {
        it('should return all free drones', async () => {
            const drones = [{ id: 'drone1', state: DroneState.IDLE }];
            (Drone.find as jest.Mock).mockResolvedValue(drones);

            const result = await DispatchService.getAllFreeDrones();

            expect(result).toEqual(drones);
            expect(Drone.find).toHaveBeenCalledWith({ state: { $in: [DroneState.IDLE] } });
        });

        it('should throw an error if fetching drones fails', async () => {
            (Drone.find as jest.Mock).mockRejectedValue(new Error('Error fetching drones'));

            await expect(DispatchService.getAllFreeDrones()).rejects.toThrow('Error getting drones try again');
        });
    });

    describe('getDroneById', () => {
        it('should return a drone by id', async () => {
            const drone = { id: 'drone1' };
            (Drone.findById as jest.Mock).mockResolvedValue(drone);

            const result = await DispatchService.getDroneById('drone1');

            expect(result).toEqual(drone);
            expect(Drone.findById).toHaveBeenCalledWith('drone1');
        });

        it('should throw an error if fetching drone by id fails', async () => {
            (Drone.findById as jest.Mock).mockRejectedValue(new Error('Error fetching drone'));

            await expect(DispatchService.getDroneById('drone1')).rejects.toThrow('Error getting drone by id try again');
        });
    });

    describe('loadDrone', () => {
        it('should load a drone with medication', async () => {
            const loadDroneRequest: LoadDroneRequest = {
                droneId: 'drone1',
                medication: { name: 'Med1', weight: 10, code:'SERTP09', imageUrl: 'http://bal.com' } as Medication
            };
            const drone = { id: 'drone1', name:'drone1', serialNumber:'BLABLA2345', weightLimit: 100, state: DroneState.IDLE, save: jest.fn() };
            const loadLog = { droneId: 'drone1', medications: [], status: DroneState.LOADING, save: jest.fn() };
            const loadLogResult = { droneId: 'drone1', medications: [loadDroneRequest.medication], status: DroneState.LOADING, save: jest.fn() };
            
            (Drone.findById as jest.Mock).mockResolvedValue(drone);
            (LoadLog.findOne as jest.Mock).mockResolvedValue(loadLog);
            (LoadLog.create as jest.Mock).mockResolvedValue(loadLog);

            const result = await DispatchService.loadDrone(loadDroneRequest);

            console.log(result, 'RESSSSSS');

            expect(result).toEqual(loadLogResult);
            expect(loadLog.medications).toContain(loadDroneRequest.medication);
            expect(drone.state).toBe(DroneState.LOADING);
            expect(drone.save).toHaveBeenCalled();
            expect(loadLog.save).toHaveBeenCalled();
        });

        it('should throw an error if drone weight limit is exceeded', async () => {
            const loadDroneRequest: LoadDroneRequest = {
                droneId: 'drone1',
                medication: { name: 'Med1', weight: 110 } as Medication
            };
            const drone = { id: 'drone1', name:'drone1', weightLimit: 100, state: DroneState.IDLE };
            const loadLog = { droneId: 'drone1', medications: [], status: DroneState.LOADING };

            (Drone.findById as jest.Mock).mockResolvedValue(drone);
            (LoadLog.findOne as jest.Mock).mockResolvedValue(loadLog);

            await expect(DispatchService.loadDrone(loadDroneRequest)).rejects.toThrow('Drone weight limit exceeded');
        });

        it('should throw an error if loading drone fails', async () => {
            const loadDroneRequest: LoadDroneRequest = {
                droneId: 'drone1',
                medication: { name: 'Med1', weight: 10 } as Medication
            };

            (Drone.findById as jest.Mock).mockRejectedValue(new Error('Error loading drone'));

            await expect(DispatchService.loadDrone(loadDroneRequest)).rejects.toThrow('Error loading drone');
        });
    });

    describe('fetchLoadedDroneLogs', () => {
        it('should return loaded drone logs', async () => {
            const logs = [{ droneId: 'drone1', status: DroneState.LOADED }];
            (LoadLog.find as jest.Mock).mockResolvedValue(logs);

            const result = await DispatchService.fetchLoadedDroneLogs('drone1');

            expect(result).toEqual(logs);
            expect(LoadLog.find).toHaveBeenCalledWith({ droneId: 'drone1' });
        });

        it('should throw an error if fetching loaded drone logs fails', async () => {
            (LoadLog.find as jest.Mock).mockRejectedValue(new Error('Error fetching logs'));

            await expect(DispatchService.fetchLoadedDroneLogs('drone1')).rejects.toThrow('Error fetching logs');
        });
    });

    describe('updateLoadedDroneStatus', () => {
        it('should update the status of a loaded drone', async () => {
            const loadLog = { droneId: 'drone1', status: DroneState.LOADING, save: jest.fn() };
            const updateRequestBody = { status: DroneState.LOADED };

            (LoadLog.findById as jest.Mock).mockResolvedValue(loadLog);
            (Drone.updateOne as jest.Mock).mockReturnValue({
                exec: jest.fn().mockResolvedValue({ nModified: 1 })
            });
            const result = await DispatchService.updateLoadedDroneStatus('log1', updateRequestBody);

            expect(result).toEqual(loadLog);
            expect(loadLog.status).toBe(DroneState.LOADED);
            expect(loadLog.save).toHaveBeenCalled();
            expect(Drone.updateOne).toHaveBeenCalledWith({ _id: 'drone1' }, { state: DroneState.LOADED, lastTimeOfTakeOff: expect.any(Date), batteryStatus: expect.any(String) });
        });

        it('should throw an error if load log is not found', async () => {
            (LoadLog.findById as jest.Mock).mockResolvedValue(null);

            await expect(DispatchService.updateLoadedDroneStatus('log1', { status: DroneState.LOADED })).rejects.toThrow('Load log not found');
        });

        it('should throw an error if updating status fails', async () => {
            (LoadLog.findById as jest.Mock).mockRejectedValue(new Error('Error updating status'));

            await expect(DispatchService.updateLoadedDroneStatus('log1', { status: DroneState.LOADED })).rejects.toThrow('Error updating status');
        });
    });

    describe('checkDroneBatteryLevel', () => {
        it('should return the battery level of a drone', async () => {
            const drone = { id: 'drone1', batteryCapacity: 80 };
            (Drone.findById as jest.Mock).mockResolvedValue(drone);

            const result = await DispatchService.checkDroneBatteryLevel('drone1');

            expect(result).toBe(80);
            expect(Drone.findById).toHaveBeenCalledWith('drone1');
        });

        it('should throw an error if checking battery level fails', async () => {
            (Drone.findById as jest.Mock).mockRejectedValue(new Error('Error checking battery level'));

            await expect(DispatchService.checkDroneBatteryLevel('drone1')).rejects.toThrow('Error checking battery level');
        });
    });
});