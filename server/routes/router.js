const route = require('express').Router();
//user database controller
const usersController = require('../controller/userController');
//verification imports
const verifyToken = require('../controller/verifyUser');
//raw material controller
const rawMController = require('../controller/rawMaterialCont');
//process controller
const processController = require('../controller/processCont');
//transactions controller
const transactionsController = require('../controller/transactionController');
//reports controller
const reportsController = require('../controller/reports');



// API for Login/Signup
route.post('/api/createUser',usersController.createUser);
route.post('/api/loginUser',usersController.loginUser);

//Api for Raw materials
route.post('/api/addRawMaterial',verifyToken,rawMController.addRaw);
route.post('/api/viewRawMaterial',verifyToken,rawMController.viewRaw);
route.post('/api/deleteRawMaterial',verifyToken,rawMController.viewRaw);

//API for process
route.post('/api/addProcess',verifyToken,processController.addProcess);
route.post('/api/getProcess',verifyToken,processController.getProcess);
route.post('/api/allProcess',verifyToken,processController.allProcess);
route.post('/api/deleteProcess',verifyToken,processController.deleteProcess);
route.post('/api/deleteSingleProcess',verifyToken,processController.deleteSingleProcess);

//API for Transactions
route.post('/api/transactions/increase/purchase',verifyToken,transactionsController.purchase);
route.post('/api/transactions/increase/manual',verifyToken,transactionsController.manualIncrease);
route.post('/api/transactions/decrease/manual',verifyToken,transactionsController.manualDecrease);
route.post('/api/transactions/decrease/lotWise',verifyToken,transactionsController.lotWiseUsage);


//API for Reports
route.post('/api/reports/inventory',verifyToken,reportsController.inventory);


module.exports=route;