const route = require('express').Router();
//user database controller
const usersController = require('../controller/userController');
//verification imports
const verifyToken = require('../controller/verifyUser');
//raw material controller
const rawMController = require('../controller/rawMaterialCont');




// API for Login/Signup
route.post('/api/createUser',usersController.createUser);
route.post('/api/loginUser',usersController.loginUser);

//Api for Raw materials
route.post('/api/addRawMaterial',verifyToken,rawMController.addRaw);

module.exports=route;