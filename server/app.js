/*
============================================
; Title: app.js
; Author: Professor Krasso
; Date: 29 March 2021
; Modified By: Arlix Sorto
; Description: Week 4
;===========================================
*/ 

/**
 * Require statements
 */
const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');                        
const path = require('path');
const mongoose = require('mongoose');

const EmployeeAPI = require('./routes/employee-route');

/**
 * App configurations
 */
let app = express();
app.use(express.json());
app.use(express.urlencoded({'extended': true}));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../dist/nodebucket')));
app.use('/', express.static(path.join(__dirname, '../dist/nodebucket')));

/**
 * Variables
 */
const port = process.env.PORT || 3000; // server port

// MongoDB connection string
const conn = 'mongodb+srv://nodebucket_user:admin@cluster0.ilrms.mongodb.net/nodebucket?retryWrites=true&w=majority';

/**
 * Database connection
 */
mongoose.connect(conn, {
  promiseLibrary: require('bluebird'),
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
}).then(() => {
  console.debug(`Connection to the database instance was successful`);
}).catch(err => {
  console.log(`MongoDB Error: ${err.message}`)
}); // end mongoose connection

/**
 * API(s) go here...
 */
app.use('/api/employees', EmployeeAPI);

/**
 * Create and start server
 */
http.createServer(app).listen(port, function() {
  console.log(`Application started and listening on port: ${port}`)
}); // end http create server function
