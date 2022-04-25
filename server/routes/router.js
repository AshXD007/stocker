const route = require('express').Router();
const usersController = require('../controller/userController');



route.get('/',async(req,res)=>{
    res.send('here from routes')
})


// API

route.post('/api/createUser',usersController.createUser)
// route.post('/api/login-user',usersController.loginUser)


module.exports=route;