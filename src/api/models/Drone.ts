import mongoose from "mongoose";
import { DroneModel } from '../Enums/DroneModel'
import { DroneState } from "../Enums/DroneState";
const Schema = mongoose.Schema;

const DroneSchema =  new Schema({
    serialNumber : {
        type : String,
        required: true
    },
    model: {
        type : String,
        required : true,
        default : 'Light',
        enum : ['Light', 'Normal', 'Heavy']
    },
    weightLimit: {
        type : String,
        required : true,
        enum : {
            values : [DroneModel.CRUISEWEIGHT, DroneModel.HEAVYWEIGHT, DroneModel.LIGTHWEIGHT, DroneModel.MIDDLEWEIGHT],
            message : '${VALUE} is not a valid limit'
        }
    },
    batteryCapacity:{
        type: Number,
        required: true,
        max: [100, 'Battery capacity cannot exceed 100']
    },
    state:{
        type: String,
        enum: {
            values: [DroneState.IDLE, DroneState.LOADED, DroneState.LOADING, DroneState.DELIVERING, DroneState.DELIVERED, DroneState.RETURNING],
            message: "{VALUE} not a valid state"
        },
        required: true
    }
}, {timestamps : true})

const Drone = mongoose.model("Order", DroneSchema)
export default Drone;