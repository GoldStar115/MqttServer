var dotenv = require('dotenv');
dotenv.load();
var http = require("http"),
  url = require("url"),
  process_mqtt = require('./process/process-mqtt'), 
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
var firstPort = process.env.PORT || 3001;
function getFreePort(callback) {
  var port = firstPort;
  firstPort++;
  var server = http.createServer();
  server.listen(port, function (err) {
    server.once('close', function () {
      callback(port);
    });
    server.close();
  });
  server.on('error', function (err) {
    getFreePort(callback);
  });
}
getFreePort(function(port) {
  http.createServer(function(request, response) {
    try {
    }catch (error){        
    }    
  }).listen(port);
  console.log("Datafeed running at\n => http://localhost:" + port + "/\nCTRL + C to shutdown");
});
module.exports = app;

