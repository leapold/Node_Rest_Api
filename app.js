//npm install --save-dev nodemon
const express = require('express');
const app = express();

const morgan = require('morgan');

const bodyParser = require("body-parser");

//npm install --save mongoose
const mongoose = require("mongoose");

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

 
 
const connect = async () => {
    try {
      await mongoose.connect(process.env.MONGO_ATLAS_PW);
      console.log("Connected to mongoDB.");
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  
  mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!");
  });
 

//all request pass morgan
//npm install --save morgan
app.use(morgan('dev'));

app.use('/uploads',express.static('uploads'));

//npm install --save body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cross-origin resource sharing (CORS) is a mechanism for integrating applications.
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");// access to any client
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");// what type of header allows
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
  });

// Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

//not pass routes
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


app.listen(8800, () => {
    connect();
    console.log("Connected to backend.");
  });

module.exports = app;