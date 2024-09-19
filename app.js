//npm install --save-dev nodemon
const express = require('express');
const app = express();

const morgan = require('morgan');

const bodyParser = require("body-parser");

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

//all request pass morgan
//npm install --save morgan
app.use(morgan('dev'));

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

module.exports = app;