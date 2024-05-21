const express = require("express");
const Booking = require('../models/booking.model.js');
const routers =express.Router();
const {createBooking, getStatus, getPrevBookings, getBookings, getBooking, updateReadyForDelivery,updateCompleted} = require('../controller/booking.controller.js');


routers.post('/',createBooking);
routers.get('/status/:id',getStatus);
routers.get('/prevBookings',getPrevBookings);
routers.get('/',getBookings);
routers.get('/:id',getBooking);
routers.put('/updateReadyForDelivery/:id',updateReadyForDelivery);
routers.put('/updateCompleted/:id',updateCompleted);

module.exports =routers;