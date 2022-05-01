const route = require('express').Router();
const usersController = require('../controller/userController');
const verifyToken = require('../controller/verifyUser');





// API

route.post('/api/createUser',usersController.createUser);
route.post('/api/loginUser',usersController.loginUser);


module.exports=route;