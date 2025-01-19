import mongoose, { Document, Schema, Model, model } from "mongoose";
import { DroneModel } from '../Enums/DroneModel'
import { DroneState } from "../Enums/DroneState";
const Schema = mongoose.Schema;

interface DroneDocument extends Document {
    name: string;
    state: DroneState;
    weightLimit: number;
    batteryCapacity: number;
    serialNumber: string;
    model: DroneModel;
}

const DroneSchema =  new Schema<DroneDocument>({
    serialNumber : {
        type : String,
        required: true,
        unique: true
    },
    model: {
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
    }
}, {timestamps : true})

const Drone = mongoose.model("Drone", DroneSchema)
DroneSchema.set('toJSON', {
    transform: (_, ret) => {
      ret.id = ret._id.toString();
      delete ret._id
      delete ret.__v;
      return ret;
    },
});

export default Drone;