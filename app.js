// Morgan is a http logger middleware for node.js (Read morgan documentation)
// Read the cors documentation

var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dbconfig = require('./config/dbconfig');
var cors = require('cors');
var app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}));

require('./models/Posts');
require('./models/Comments');

var routes = require('./routes/index');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
mongoose.connect(dbconfig.DB_URL);
dbconfig.dbconnection(mongoose);

app.use('/', routes);

// catch 404 and forward to error handler (When call made to invalid API Endpoint)
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {   // or use 'errorhandler' npm module (send error to client)
        res.status(err.status || 500);    // error without error code or unknown error specified as internal server error
        res.send(err.message);
    });
}

/*
// production error handler no stacktrace leaked to user
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
*/

app.listen(3001, function () {
    console.log("Server listening at port 3001");
});