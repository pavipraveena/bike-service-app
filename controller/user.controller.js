const User = require("../models/user.model.js");
const jwt = require('jsonwebtoken');
require('dotenv').config()
const emailValidator = require("node-email-validation");

// Validate the user fields and add in db
const createUser = async(req,res) =>{
    
    try {
        const request = req.body
        
        if(!request.name){
            return res.status(400).json({message: "Name field is required"});
        }

        if(!request.email){
            return res.status(400).json({message: "Email field is required"});
        }else{
            // validate if an email is correct
            if(!emailValidator.is_email_valid(request.email)){
                return res.status(400).json({message: "Email is invalid"});
            }
        }
        if(!request.password){
            return res.status(400).json({message: "Password field is required"});
        }
        if(!request.phoneNo){
            return res.status(400).json({message: "PhoneNo field is required"});
        }else{
            //  validate if a phone no is correct
            if(request.phoneNo.toString().length!=10){
                return res.status(400).json({message: "PhoneNo is invalid"});
            }
        }
        if(request.role){
            // validate if role is either ADMIN or CUSTOMER
            if(request.role != 'ADMIN' && request.role != 'CUSTOMER'){
                return res.status(400).json({message: "Role is invalid"});
            }
        }else{
            request.role = 'CUSTOMER';
        }
        
        // validate if email already exists
        const existingUser = await User.findOne({ email: request.email});
        if(existingUser){
            return res.status(400).json({message: "Email already exists"});
        }
        
        const  result = await User.create(request);
        res.status(200).json(result)
       } catch (error) {
        res.status(500).json({message: error.message});
       }
};


const updateUser = async(req,res) =>{
    try {
        const authUser = authorize(req);
        const userId = authUser.id;
        const userRole = authUser.role;
        const {id} = req.params;
        const user = req.body;

        // logged in user didn't have access
        if(userId != id){
            return res.status(400).json({message: "User didn't have access" });        
        }        
        if(user.email){
            return res.status(400).json({message: "User cannot update email" });    
        }
        if(user.phoneNo){
            if(user.phoneNo.toString().length != 10){
            return res.status(400).json({message: "Invalid phoneNo" });   
            }
        }
        if(user.role){
            return res.status(400).json({message: "User cannot update role" });        
        }
        // validate if user exists
        const existingUser = await User.findById(id);
        if(!existingUser){
            return res.status(404).json({message:  "User not found"});
        }

        const filter = { _id: id };
        await User.updateOne(filter, user);
        const updatedUser = await User.findById(id);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({message: error.message});

    }
};

const deleteUser = async(req,res) =>{
    try {
        const authUser = authorize(req);
        const userId = authUser.id;
        const {id} = req.params;
        // logged in user didn't have access
        if(userId != id){
            return res.status(400).json({message: "User didn't have access" });        
        }          
        const user = await User.findByIdAndDelete(id);
        // validate if user exists
        if(!user){
            return res.status(404).json({message:  "User not found"});
        }
        res.status(200).json({message: "User Deleted" });
    } catch (error) {
        
    }
};

const getUsers = async(req,res) => {
    try {
        const authUser = authorize(req);
        const userId = authUser.id;
        const userRole = authUser.role;
        if(userRole != 'ADMIN'){
            let users = await User.find({ _id : userId});
            res.status(200).json(users);        
        }else{
            let users = await User.find();
            res.status(200).json(users);
        }
        
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getUser = async(req,res) =>{
    try {
        const authUser = authorize(req);
        const userId = authUser.id;
        const {id} = req.params;
        // logged in user didn't have access
        if(userId != id){
            return res.status(400).json({message: "User didn't have access" });        
        }
        // validate if user exists
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({message:  "User not found"});
        }
        return res.status(200).json(user);
    } catch (error) {  
        res.status(500).json({message: error.message});
    }
};

// method used to verify user is logged in
function authorize(req) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    let decodedToken = null;
    if (!token) {
        throw new Error("Token is required.");
    }
    try{
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);
    }catch(error){
        console.log(error);
        throw new Error("Invalid Token.");
    }
    return {id : decodedToken.id , role : decodedToken.role};
}

module.exports={
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
}