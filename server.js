require('dotenv').config()
const express  = require('express');
const app      = express();
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const https = require('https');
const fs = require('fs');
//const session = require('express-session');
const databaseConfig = require('./config/database');
//const databaseConfig = require('database/config/database'); //
const router = require('./app/routes');
mongoose.Promise = global.Promise;


const sslkey = fs.readFileSync('privkey.pem');
const sslcert = fs.readFileSync('fullchain.pem');

const options = {
      key: sslkey,
      cert: sslcert
      //rejectUnauthorized: false
};

//mongoose.connect(databaseConfig.url);
mongoose.connect(databaseConfig.url).then(() => {
	console.log('Connected successfully ' + Date.now());
}, err => {
  console.log('Connection to db failed: ' + ' :: ' + err);
  //next(err);
});

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
//app.listen(process.env.PORT || 8080); const server =
//https.createServer(options,app).listen(process.env.PORT || 5000, () => {
http.createServer(app).listen(process.env.PORT || 5000, () => {
   console.log('Started and listening on port ' + process.env.PORT);
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
app.use(express.static('../client/public'));
//app.use(serveStatic('client/public', {'index': ['default.html', 'default.htm']}))
app.use(logger('dev')); // Log requests to API using morgan

router(app);
// handling 404 errors
app.use(function(err, req, res, next) {
  if(err.status !== 404) {
    return next();
  }
  var statusCode = err.status || 404;
  res.status(statusCode).json(err.message || 'Welcome to the job market web service, contact admin to get started');
});
