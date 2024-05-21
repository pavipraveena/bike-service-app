const Booking = require("../models/booking.model.js");
const Service = require("../models/service.model.js");
const jwt = require('jsonwebtoken');
require('dotenv').config()
const nodemailer = require('nodemailer');

const createBooking = async(req,res) =>{
    try {
        const userId = authorize(req).id;
        const booking = req.body;
        
        // Validated for create booking
        if(!booking.serviceId){
            return res.status(400).json({message: "Service Id is required" });    
        }
        if(!booking.bikeNo){
            return res.status(400).json({message: "bikeNo is required" });    
        }
        if(!booking.date){
            return res.status(400).json({message: "date is required" });    
        }
        if(isNaN(new Date(booking.date))){
            return res.status(400).json({message: "Invalid date"});
        }
        const service = await Service.findOne({ _id: booking.serviceId});
        // service not available
        if(!service){
            return res.status(400).json({message: "Service not available"});
        }

        booking.userId = userId;
        //status is default to PENDING when created
        booking.serviceStatus = 'PENDING';
        const  result = await Booking.create(booking);
        return res.status(200).json(result);
       } catch (error) {
        res.status(500).json({message: error.message});
       }
};

const getStatus = async(req,res) =>{

    try {
        let userId = authorize(req).id;
        const {id} = req.params;
        const booking = await Booking.findById(id);
        //verify if booking is available
        if(!booking){
            return res.status(400).json({message: "Booking not available"});
        }
        //logged in user didn't have access
        if(booking.userId != id){
            return res.status(403).json({message: "User don't have access"});
        }
        return res.status(200).json(booking.serviceStatus);
    } catch (error) {
        res.status(500).json({message: error.message});
    }

};

const getPrevBookings = async(req,res) => {
    try {
        const userId = authorize(req).id;
        const bookings = await Booking.find({ userId: userId});
        return res.status(200).json(bookings);

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

const getBookings = async(req,res) => {

    try {
        const authUser = authorize(req);
        const userRole = authUser.role;
        //customer didn't have access to all the bookings
        if(userRole == 'CUSTOMER'){
            return res.status(400).json({message: "User didn't access" });        
        }
        const bookings = await Booking.find();
        res.status(200).json(bookings);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getBooking = async(req,res) =>{
    try {
        const authUser = authorize(req);
        const userRole = authUser.role;
        const {id} = req.params;
        if(userRole == 'CUSTOMER'){
            return res.status(400).json({message: "User didn't access" });        
        }
        const booking = await Booking.findById(id);
        // verify if the booking is available
        if(!booking){
            res.status(400).json({message: "Booking not available"});
        }
        return res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({message: error.message});
    }

};

const updateReadyForDelivery = async(req,res) =>{
    try {
        const authUser = authorize(req);
        const userRole = authUser.role;
        const {id} = req.params;
        // only ADMINS can update the status
        if(userRole == 'CUSTOMER'){
            return res.status(400).json({message: "User didn't access" });        
        }  
        const existingBooking = await Booking.findById(id);
        if(!existingBooking){
            return  res.status(400).json({message: "Booking not available"});
        }
        const filter = { _id: id };
        const values = {serviceStatus: "READY_FOR_DELIVERY"};
        console.log(await Booking.updateOne(filter, values));
        res.status(200).json("Booking updated to ready for delivery");

    } catch (error) {
        res.status(500).json({message: error.message});

    }
}

const updateCompleted = async(req,res) =>{
    try {
        const authUser = authorize(req);
        const userRole = authUser.role;
        const {id} = req.params;
        // only ADMINS can update the status
        if(userRole == 'CUSTOMER'){
            return res.status(400).json({message: "User didn't access" });        
        }  
        const existingBooking = await Booking.findById(id);
        if(!existingBooking){
            return  res.status(400).json({message: "Booking not available"});
        }
        const filter = { _id: id };
        const values = {serviceStatus: "COMPLETED"};
        await Booking.updateOne(filter, values);
        res.status(200).json("Booking updated to completed");

    } catch (error) {
        res.status(500).json({message: error.message});

    }
}

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

function sendMail() {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'pavipraveenag@gmail.com',
        pass: 'test@123'
        }
    });

    var mailOptions = {
        from: 'pavipraveenag@gmail.com',
        to: 'paviganeshan20@gmail.com',
        subject: 'Bike service',
        text: 'Booking is made'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}


module.exports={
    createBooking,
    getStatus,
    getPrevBookings,
    getBookings,
    getBooking,
    updateReadyForDelivery,
    updateCompleted
}