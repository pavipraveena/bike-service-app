const { ObjectId } = require("mongodb");
const mongoose=require("mongoose");

const BookingSchema=mongoose.Schema({
    userId : {
        type: ObjectId,
        require:true
    },
    serviceId : {
        type: ObjectId,
        require:true
    },
    bikeNo:{
        type: String,
        require:true
    },
    serviceStatus:{
        type: String,
        require:true
    },
    date:{
        type: String,
        require:true
    }
},
 {
    timestamps:true,
 }
);

const Booking = mongoose.model("Booking",BookingSchema);

module.exports=Booking;