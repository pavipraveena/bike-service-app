const User = require("../models/user.model.js");
const jwt = require('jsonwebtoken');
require('dotenv').config()

const login = async(req,res) =>{
    
        let email = req.body.email;
        let password=req.body.password;

        let existingUser = await User.findOne({ email: email});

        if(!existingUser){
            res.status(400).json({message: "User not found"});
        }
        if(password !== existingUser.password){
            res.status(400).json({message: "Invalid password"});
        }
        const user = {
            id : existingUser.id,
            email: existingUser.email,
            role : existingUser.role
        };
        const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN,{ expiresIn: "1h" });
        res.json({accessToken : accessToken})

};

module.exports={
    login
}





