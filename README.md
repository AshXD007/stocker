# STOCKER - Inventory management API service
#### Video Demo:  <https://www.youtube.com/watch?v=-ObUAIsAmoU&ab_channel=MdAshad>
#### Description:
**Stocker is a backend API for inventory management designed for manufacturing industries**


## Main Features

## User Authentication

* Create a new account or login into your account 
    * Routes for this feature
```
    https://stocker-backend-api.herokuapp.com/api/createUser/
```

```
    https://stocker-backend-api.herokuapp.com/api/loginUser/
```

## Raw material Management

* Use this feature to manage the raw materials(the main products whose inventory will be managed)
    * Routes for this feature
```
https://stocker-backend-api.herokuapp.com/api/addRawMaterial
```
```
https://stocker-backend-api.herokuapp.com/api/viewRawMaterial
```
```
https://stocker-backend-api.herokuapp.com/api/deleteRawMaterial
```


## Process (recipe / the ratios of raw material(ratio * base weight = quantity used) used per lot ) Management

* Use this to manage the production process 
    * Routes for this feature

```
https://stocker-backend-api.herokuapp.com/api/addProcess
```

```
https://stocker-backend-api.herokuapp.com/api/getProcess
```
```
https://stocker-backend-api.herokuapp.com/api/allProcess
```
```
https://stocker-backend-api.herokuapp.com/api/deleteProcess
```
```
https://stocker-backend-api.herokuapp.com/api/deleteSingleProcess
```

## Transaction recording

* Use this to manage inventory transactions of raw materials
    * Rotes for this feature
```
https://stocker-backend-api.herokuapp.com/api/transactions/increase/purchase
```
```
https://stocker-backend-api.herokuapp.com/api/transactions/increase/manual
```
```
https://stocker-backend-api.herokuapp.com/api/transactions/decrease/manual
```
```
https://stocker-backend-api.herokuapp.com/api/transactions/decrease/lotWise
```



## Structure/design of program

* The main server language is Node.js , using express. MongoDb is used as the database , and mongoose to connect.
* The folder Structure is in MVC format.
* The code is distributed into multiple files each for specific features.
* _router.js_ is the main route controlling file
* _server.js_ is the main server file


## Future Development

* More API's for getting Reports and Data for EG
    * lot usage filtered by time/process used
    * seller wise purchase register filtered by time
    * all transaction on raw material filtered by time
* API's to let client download the reports in a PDF format

## Struggles / Issues
I first used postgres as a database , but could deploy with postgres , so had to change the database to mongodb (i did not had much time , this is why data models are not very efficient as they were designed for SQL database)

