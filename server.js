#!/usr/bin/env node

var debug = require('debug')('neuralnet:server');
var http = require('http');
var express = require("express");
var bodyParser = require('body-parser');

var api = express();

api.use(logger('dev'));
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));

var network = require('express-network.js');
api.post('/',   network.new);
api.put('/:id', network.input);
api.get('/:id', network.process);


// If no other route handlers apply, 404
api.use(function(req, res, next) {
    res.status(404).send('404 Not Found!');

    // var err = new Error('Not Found');
    // err.status = 404;
    // next(err);
});

// Error handler
api.use(function (err, req, res, next) {
    // HTTP 401 Unauthorized
    if (err.name === 'UnauthorizedError')
        res.status(401);

    // Other errors
    else
        res.status(500);

    res.json({"message" : err.name + ": " + err.message});
});


var port = normalizePort(process.env.PORT || '3000');
api.set('port', port);



var server = http.createServer(api);    // Using express app
server.listen(port);                    // Start node server

server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port))  // named pipe
      return val;

  if (port >= 0)    // port number
      return port;

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen')
      throw error;

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}