
export const config = {
    dbUrl : process.env.DB_URI || "mongodb://localhost:27017/dronedelivery",
    batteryDropRate: 2, // 2% drop rate per 15 minute for example
    batteryDropTime: 15, // every 15 minutes
    cronInterval: process.env.CRON_INTERVAL || '*/30 * * * *', // every 30 minutes
    batteryGainRate: 10, // 10% gain rate per 20 minute for example
    batteryGainTime: 20, // every 20 minutes
}