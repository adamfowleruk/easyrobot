var winston = require("winston");


  
var WebSocketServer = require('websocket').server;
var fs = require('fs');
var restify = require('restify');



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
  
  // NB More than one node may be publishing a topic
  // NB more than one node can provide a service??? Is this ever done?
  this._advertisedTopics = new Array(); // {id: "", topic: "", type: ""}
  this._publicAdvertisedTopics = new Array(); // {topic: "", type: ""}
  this._topicSubscriptions = new Array(); // {id: "", topic: "", type: "", throttle_rate: int, queue_length: int, fragment_size: int, compression: "none|png"}
  this._availableServices = new Array(); // {id: "", service: "", args: [{name: "", type: "", required: boolean}, ... ], compression: ["none","png"]}
  this._publicAvailableServices = new Array(); // {service: "", args: [{name: "", type: "", required: boolean}, ... ], compression: ["none","png"]}
  
  this._servers = new Array(); // {type: "rest|rosapi", id: "", config: {unspecified}}
  
  this._nextServerId = 1;
};

server.prototype.setLogger = function(logger) {
  this.logger = logger;
};

server.prototype.begin = function() {
};



// GENERAL MESSAGE PASSING METHODS
server.prototype._handleRosApiClientMessage = function(sj,socketClientConnection,request,json) {
  // if from ROS API could be one of:-
  var op = json.op;
  this._rosapiHandlers[op].call(this,sj,socketClientConnection,request,json); // throws undefined error if op not supported. TODO add better error handling
  // TODO verify it's call and not the other js call alternative (apply)
};

server.prototype._rosapiHandlers = {
  "auth": function(sj,socketClientConnection,request,json) {
    
  },
  "call_service": function(sj,socketClientConnection,request,json) {
    
  },
  "subscribe": function(sj,socketClientConnection,request,json) {
    
  },
  "unsubscribe": function(sj,socketClientConnection,request,json) {
    
  },
  "provide_service": function(sj,socketClientConnection,request,json) {
    
  }
};

server.prototype._rosapiServices = {
  "/rosapi/message_details": function() {
    
  } // TODO etc.
};


// Internal handler methods - normally to abstract away from underlying protocol/server connections

server.prototype._distributeMessage = function(topic,messageJson) {
  
};

server.prototype._sendServiceResponse = function(service,callid,messageJson) {
  
};






// REST METHODS

server.prototype._handleRestMessagePublish = function(sj,req,res,next) {
  var json = JSON.parse(req.body.toString());
  var topic = req.params.topic;
  var messageid = req.params.messageid;
  
  this._distributeMessage(topic,json);
};

server.prototype._handleRestServiceResponse = function(sj,req,res,next) {
  // TODO handle XML and other types of message via REST too (by HTTP Content-Type header)
  var json = JSON.parse(req.body.toString());
  var service = req.params.service;
  var callid = req.params.callid;
  
  this._sendServiceResponse(services,callid,json);
};

/**
 * Starts a HTTP REST message receiving listener on a specified port
 */
server.prototype.startRestListener = function(settings) {
  var server = restify.createServer();
  server.use(restify.bodyParser()); // { mapParams: false }
  
  var self = this;
  var id = this._nextServerId++;
  var port = settings.port || 8081;
  var sj = {type: "rest", id: id, config: {server: server, settings: settings, port: port}};
  this._servers.push(sj);
  
  // POST /v1/topic/<URI-Encoded-topic-ref>/messages/<message-id>
  server.post("/v1/topic/:topic/messages/:messageid",function(req,res,next) {
    self._handleRestMessagePublish(sj,req,res,next);
  });
  
  // POST /v1/service/<service-name>/response/<call-id>
  server.post("/v1/service/:service/response/:callid",function(req,res,next) {
    self._handleRestServiceResponse(sj,req,res,next);
  });
  
  server.listen(port, function() {
    console.log('%s listening at %s', server.name, server.url);
  });
};



// ROSAPI METHODS



/**
 * Listen for Rosbridge 2.0 API websockets connections. Ignore base http connections.
 */
server.prototype.startWebsocketsListener = function(settings) {
  var httpServer = http.createServer(
    function(request, res) {
    }
  );
  var port = settings.port || 8080;
  httpServer.listen(port, function() {
    console.log((new Date()) + ' Server is listening on port ' + port);
  });
  
  // SET UP CLIENT WEB SOCKETS SERVER

  var wsServer = new WebSocketServer({
    httpServer: httpServer,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
  });
  
  var id = this._nextServerId++;
  
  var sj = {type: "rosapi", id: id, config: {wsServer: wsServer, httpServer: httpServer, port: port, settings: settings}};
  
  this._servers.push(sj);
  
  var self = this;
  
  // set up handlers
  
  function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
  };

  wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var socketClientConnection = request.accept(null, request.origin); // null = no sub protocol
    socketClientConnection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            
            // OLD socketClientConnection.sendUTF(message.utf8Data);
            // try to get JSON
            var json = JSON.parse(message.utf8Data);
            
            // do something with it
            self._handleRosApiClientMessage(sj,socketClientConnection,request,json);
            
        } else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            //socketClientConnection.sendBytes(message.binaryData);
            
            // NB won't be handling binary messages - PNG bonary encoding only done on data payload, not on whole JSON message
            
        }
    });
    
    socketClientConnection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + socketClientConnection.remoteAddress + ' disconnecting...');
        
        // remove client
        
        console.log((new Date()) + ' Peer ' + socketClientConnection.remoteAddress + ' disconnected.');
    });
    
  } // end wsServer.on(request) 
};





module.exports = function() {
  return {
    Server: server
  };
};

