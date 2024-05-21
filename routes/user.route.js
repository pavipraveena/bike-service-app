const express = require("express");
const User = require('../models/user.model.js');
const router =express.Router();
const { getUsers, getUser, createUser, updateUser, deleteUser } = require("../controller/user.controller.js");
 
router.get('/',getUsers);
router.get('/:id',getUser);
router.post('/',createUser);
router.put('/:id',updateUser);
router.delete('/:id',deleteUser);

module.exports =router;