const express = require("express");
const User = require('../models/user.model.js');
const router =express.Router();
const {login} = require('../controller/auth.controller.js');

router.post('/auth',login);


module.exports =router;