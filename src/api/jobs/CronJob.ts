import cron from 'node-cron';
import { checkDroneBatteryLevels } from '../services/DroneSchedule';
import { config } from '../../config';

// Schedule tasks to be run on the server
cron.schedule(config.cronInterval, async () => {
    console.log('Running battery level task every hour');
    await checkDroneBatteryLevels();
});