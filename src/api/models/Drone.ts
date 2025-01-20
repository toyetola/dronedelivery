import mongoose from "mongoose";
import { Schema, Model, Document } from 'mongoose';
import { DroneModel } from '../Enums/DroneModel'
import { DroneState } from "../Enums/DroneState";
import { BatteryState } from "../Enums/BatteryState";

interface DroneDocument extends Document {
    name: string;
    state: DroneState;
    weightLimit: number;
    batteryCapacity: number;
    serialNumber: string;
    droneModel: DroneModel;
    batteryStatus: BatteryState;
    lastTimeOfTakeOff: Date;
    startChargeTime: Date;
}

const DroneSchema : Schema =  new Schema<DroneDocument>({
    serialNumber : {
        type : String,
        required: true,
        unique: true
    },
    droneModel: {
        type : String,
        required : true,
        enum : {
            values : [DroneModel.CRUISEWEIGHT, DroneModel.HEAVYWEIGHT, DroneModel.LIGTHWEIGHT, DroneModel.MIDDLEWEIGHT],
            message : '${VALUE} is not a valid limit'
        }
    },
    weightLimit: {
        type : Number,
        required : true,
        max :[500, 'Weight Limit should be 500 grams max']
    },
    batteryCapacity:{
        type: Number,
        required: true,
        max: [100, 'Battery capacity cannot exceed 100']
    },
    state:{
        type: String,
        default:DroneState.IDLE,
        enum: {
            values: [DroneState.IDLE, DroneState.LOADED, DroneState.LOADING, DroneState.DELIVERING, DroneState.DELIVERED, DroneState.RETURNING],
            message: "{VALUE} not a valid state"
        },
        required: true
    },
    batteryStatus: {
        type: String,
        enum: {
            values: [BatteryState.CHARGING, BatteryState.NOTCHARGING],
            message: "{VALUE} not a valid state"
        }
    },
    lastTimeOfTakeOff: {
        type: Date
    },
    startChargeTime : {
        type: Date
    }
}, {timestamps : true})

const Drone : Model<DroneDocument> = mongoose.model<DroneDocument>("Drone", DroneSchema)
DroneSchema.set('toJSON', {
    transform: (_:any, ret:any) => {
      ret.id = ret._id.toString();
      delete ret._id
      delete ret.__v;
      return ret;
    },
});

export default Drone;