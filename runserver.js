var winston = require("winston");


var logger = new (winston.Logger)({
  transports: [
    new winston.transports.Console()
  ],
  exceptionHandlers: [
    new winston.transports.Console()
  ]
});
  
var EasyRobotServer = require("./easyrobot").Server;

var server = new EasyRobotServer(); // defaults
server.setLogger(logger);

server.begin();