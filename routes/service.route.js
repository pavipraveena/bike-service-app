const express = require("express");
const Service = require('../models/service.model.js');
const routers =express.Router();
const {getServices, getService, createService, updateService, deleteService} = require('../controller/service.controller.js');

routers.get('/',getServices);
routers.get('/:id',getService);
routers.post('/',createService);
routers.put('/:id',updateService);
routers.delete('/:id',deleteService);

 

module.exports =routers;