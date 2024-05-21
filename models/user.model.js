const mongoose=require("mongoose");

const UserSchema=mongoose.Schema({
    name:{
        type: String,
        require:[true,"Please enter the name"]
    },
    password:{
        type: String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    phoneNo:{
        type:Number,
        require:true
    },
    role: {
        type:String,
        require:true
    }
},
 {
    timestamps:true,
 }
);

const User = mongoose.model("User",UserSchema);

module.exports=User;