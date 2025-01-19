import mongoose from "mongoose";
const Schema = mongoose.Schema;


const MedicationSchema =  new Schema({
    name : {
        type : String,
        required: true
    },
    weight: {
        type : Number,
        required : true,
        min: [1, 'Weight cannot be less than 1']
    },
    code: {
        type : String,
        required : true
    },
    imageUrl:{
        type: String,
        required: true,
        max: [100, 'Battery capacity cannot exceed 100']
    }
}, {timestamps : true})

const Medication = mongoose.model("Medication", MedicationSchema)
export default Medication;