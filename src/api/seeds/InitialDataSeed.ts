import Drone from '../models/Drone';
import { DroneModel } from '../Enums/DroneModel';

const droneData = [
    {
        name: 'Drone 1',
        type: 'Quadcopter',
        weightLimit: 20,
        droneModel: DroneModel.CRUISEWEIGHT,
        batteryCapacity: 60,
        serialNumber: 'ABC4567890',
    },
    {
        name: 'Drone 2',
        type: 'Hexacopter',
        weightLimit: 50,
        droneModel: DroneModel.HEAVYWEIGHT,
        batteryCapacity: 80,
        serialNumber: 'XYZ4567890',
    },
    // Add more drone data objects as needed
];

async function seedDroneData() {
    try {
        for (const drone of droneData) {
            const existingDrone = await Drone.findOne({ serialNumber: drone.serialNumber });
            if (!existingDrone) {
                await Drone.create(drone);
                console.log(`Drone ${drone.name} seeded successfully!`);
            } else {
                console.log(`Drone ${drone.name} already exists, skipping.`);
            }
        }
    } catch (error) {
        console.error('Error seeding drone data:', error);
    }
}

seedDroneData();