// export all libraries 
const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 8090;

// import
// import express  from 'express';
// import bodyparser from 'body-parser';
// import cookieParser from 'cookie-parser';
// import dotenv from 'dotenv';


//connect mongoDB
const connectDB = require('./server/database/connection')

connectDB();

// setup express app
const app = express();

//use cookie
app.use(cookieParser());

// create application/json parser
var jsonParser = bodyparser.json();

var urlencodedParser = bodyparser.urlencoded({ extended: false })
app.use(jsonParser);
app.use(urlencodedParser);

app.use('/',require('./server/routes/router'));



app.listen(PORT , ()=> console.log(`RUNNING ON http://localhost:${PORT}/`));