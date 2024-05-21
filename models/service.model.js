const { ObjectId } = require("mongodb");
const mongoose=require("mongoose");

const ServiceSchema=mongoose.Schema({
    userId : {
        type: ObjectId,
        require:true
    },
    service : {
        type: String,
        require:true
    },
    description:{
        type: String,
        require:true
    }
},
 {
    timestamps:true,
 }
);

const Service = mongoose.model("Service",ServiceSchema);

module.exports=Service;