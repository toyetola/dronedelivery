import Drone from '../api/models/Drone';
import dayjs from 'dayjs';
import { config } from '../config';
import BatteryUsageLog from '../api/models/BatteryUsageLog';
import { BatteryState } from '../api/Enums/BatteryState';
import { checkDroneBatteryLevels } from '../api/services/DroneSchedule';

jest.mock('../api/models/Drone');
jest.mock('../api/models/BatteryUsageLog');
jest.mock('dayjs', () => {
    const actualDayjs = jest.requireActual('dayjs');
    return jest.fn(() => ({
        ...actualDayjs(),
        diff: jest.fn()
    }));
});
jest.mock('../config', () => ({
    config: {
        batteryDropRate: 2,
        batteryDropTime: 15,
        batteryGainRate: 5,
        batteryGainTime: 10
    }
}));

describe('checkDroneBatteryLevels', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update battery levels for drones not charging', async () => {
        const mockDrones = [
            {
                id: 'drone1',
                batteryCapacity: 50,
                lastTimeOfTakeOff: '2023-01-01T00:00:00Z',
                batteryStatus: BatteryState.NOTCHARGING,
                save: jest.fn()
            }
        ];

        (Drone.find as jest.Mock).mockResolvedValue(mockDrones);
        (dayjs as unknown as jest.Mock).mockImplementation((date) => ({
            diff: jest.fn().mockReturnValue(30) // 30 minutes difference
        }));

        await checkDroneBatteryLevels();

        expect(Drone.find).toHaveBeenCalled();
        expect(mockDrones[0].save).toHaveBeenCalled();
        expect(BatteryUsageLog.create).toHaveBeenCalledWith({
            droneId: 'drone1',
            batteryLevel: 46 // 50 - (30 / 15) * 2
        });
    });

    it('should update battery levels for drones charging', async () => {
        const mockDrones = [
            {
                id: 'drone2',
                batteryCapacity: 50,
                startChargeTime: '2023-01-01T00:00:00Z',
                batteryStatus: BatteryState.CHARGING,
                save: jest.fn()
            }
        ];

        (Drone.find as jest.Mock).mockResolvedValue(mockDrones);
        (dayjs as unknown as jest.Mock).mockImplementation(() => ({
            diff: jest.fn().mockReturnValue(20) // 20 minutes difference
        }));

        await checkDroneBatteryLevels();

        expect(Drone.find).toHaveBeenCalled();
        expect(mockDrones[0].save).toHaveBeenCalled();
        expect(BatteryUsageLog.create).toHaveBeenCalledWith({
            droneId: 'drone2',
            batteryLevel: 60 // 50 + (20 / 10) * 5
        });
    });

    it('should handle errors gracefully', async () => {
        (Drone.find as jest.Mock).mockRejectedValue(new Error('Database error'));

        console.error = jest.fn();

        await checkDroneBatteryLevels();

        expect(console.error).toHaveBeenCalledWith('Error checking drone battery levels: Database error');
    });
});