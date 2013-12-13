var winston = require("winston");



// This file executes the Easy Robot server using the EasyRobot server library

var server = function() {
  this.logger = new (winston.Logger)({
    transports: [
      new winston.transports.Console()
    ],
    exceptionHandlers: [
      new winston.transports.Console()
    ]
  });
};

server.prototype.setLogger = function(logger) {
  this.logger = logger;
};

server.prototype.begin = function() {
  // start server listening process (websocket server)
};








module.exports = function() {
  return {
    Server: server
  };
};

