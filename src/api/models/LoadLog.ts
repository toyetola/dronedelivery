import mongoose from "mongoose";
import { DroneState } from "../Enums/DroneState";
const Schema = mongoose.Schema;


const LoadLogSchema =  new Schema({
    droneId : {
        type : Schema.Types.ObjectId,
        ref: 'Drone',
        index: true,
    },
    medications: {
        type : Array,
        required : true,
    },
    status:{
        type: String,
        enum: {
            values: [DroneState.LOADED, DroneState.LOADING, DroneState.OFFLOADED],
            default: DroneState.LOADING,
            message: "{VALUE} not a valid state"
        },
        required: true
    }
}, {timestamps : true})

const LoadLog  = mongoose.model("LoadLoag", LoadLogSchema)
LoadLogSchema.set('toJSON', {
    transform: (_, ret) => {
      ret.id = ret._id.toString();
      delete ret._id
      delete ret.__v;
      return ret;
    },
});

export default LoadLog;