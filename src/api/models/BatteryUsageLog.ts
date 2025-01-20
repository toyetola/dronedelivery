import mongoose from "mongoose";

const Schema = mongoose.Schema;


const BatteryUsageLogSchema =  new Schema({
    droneId : {
        type : Schema.Types.ObjectId,
        ref: 'Drone',
        index: true,
    },
    batteryLevel: {
        type : Number,
    }
}, {timestamps : true})

const BatteryUsageLog  = mongoose.model("LoadLoag", BatteryUsageLogSchema)
BatteryUsageLogSchema.set('toJSON', {
    transform: (_, ret) => {
      ret.id = ret._id.toString();
      delete ret._id
      delete ret.__v;
      return ret;
    },
});

export default BatteryUsageLog;