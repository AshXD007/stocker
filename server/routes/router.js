const route = require('express').Router();
//user database controller
const usersController = require('../controller/userController');
//verification imports
const verifyToken = require('../controller/verifyUser');
//raw material controller
const rawMController = require('../controller/rawMaterialCont');
//process controller
const processController = require('../controller/processCont');




// API for Login/Signup
route.post('/api/createUser',usersController.createUser);
route.post('/api/loginUser',usersController.loginUser);

//Api for Raw materials
route.post('/api/addRawMaterial',verifyToken,rawMController.addRaw);
route.post('/api/viewRawMaterial',verifyToken,rawMController.viewRaw);

route.post('/api/addProcess',verifyToken,processController.addProcess);
route.post('/api/getProcess',verifyToken,processController.getProcess);
route.post('/api/allProcess',verifyToken,processController.allProcess);
route.post('/api/deleteProcess',processController.deleteProcess);
module.exports=route;