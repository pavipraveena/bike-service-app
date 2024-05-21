const Service = require("../models/service.model.js");
const jwt = require('jsonwebtoken');
require('dotenv').config()
const nodemailer = require('nodemailer');

const createService = async(req,res) =>{
    try {
        const authUser = authorize(req);
        const userId = authUser.id;
        const userRole = authUser.role;
        const request = req.body;
        // Only ADMIN have service add access
        if(userRole != 'ADMIN'){
            return res.status(400).json({message: "User didn't have access" });        
        }
        if(!request.service){
            return res.status(400).json({message: "Service field is required"});
        }
        //Verify the service already exists
        const service = await Service.findOne({ service: request.service});
        if(service){
            return res.status(400).json({message: "Service already available"});
        }
        request.userId = userId;
        const result = await Service.create(request);
        res.status(200).json(result);
       } catch (error) {
        res.status(500).json({message: error.message});
       }
};

const updateService = async(req,res) =>{
    try {
        const authUser = authorize(req);
        const userRole = authUser.role;
        const {id} = req.params;
        // Only ADMIN have service update access
        if(userRole != 'ADMIN'){
            return res.status(400).json({message: "User didn't have access" });        
        }
        //check if service exists
        const existingService = await Service.findById(id);
        if(!existingService){
            return  res.status(400).json({message: "Service not available"});
        }
        const service = req.body;
        service.id = id;
        const filter = { _id: id };
        await Service.updateOne(filter, req.body);
        const updatedProduct = await Service.findById(id);
        return res.status(200).json(updatedProduct);
        
    } catch (error) {
        res.status(500).json({message: error.message});

    }
};

const deleteService = async(req,res) =>{
    try {
        const authUser = authorize(req);
        const userId = authUser.id;
        const userRole = authUser.role;
        const {id} = req.params;
        // Only ADMIN have service update access
        if(userRole != 'ADMIN'){
            return res.status(400).json({message: "User didn't have access" });        
        } 
        const service = await Service.findByIdAndDelete(id);
        //check if service exists
        if(!service){
            return res.status(404).json({message:  "Servie not found"});
        }
        res.status(200).json({message: "Service Deleted" });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getServices = async(req,res) => {

    try {
        const authUser = authorize(req);
        const userRole = authUser.role;
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getService = async(req,res) =>{

    try {
        const authUser = authorize(req);
        const userId = authUser.id;
        const userRole = authUser.role;
        const {id} = req.params;
        // Only ADMIN have service get access
        if(userRole != 'ADMIN'){
            return res.status(400).json({message: "User didn't have access" });        
        }
        const service = await Service.findById(id);
        //check if service exists
        if(!service){
            return res.status(400).json({message: "Service not available"});
        }
        return res.status(200).json(service);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

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
    getServices,
    getService,
    createService,
    updateService,
    deleteService
}