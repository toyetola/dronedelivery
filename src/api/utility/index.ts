
interface DroneResponse {
    name: string;
    state: string;
    weightLimit: number; 
    batteryCapacity: number; 
}
export const mapDrones = (drones: DroneDocuDroment | DroneDocument[]): DroneResponse | DroneResponse[] => {
    if (Array.isArray(drones)) {
        // If input is an array, map over it
        return drones.map((drone) => ({
            name: drone.name,
            state: drone.state,
            weightLimit: drone.weightLimit,
            batteryCapacity: drone.batteryCapacity,
        }));
    } else {
        // If input is a single object, map its properties
        return {
            name: drones.name,
            state: drones.state,
            weightLimit: drones.weightLimit,
            batteryCapacity: drones.batteryCapacity,
        };
    }
}