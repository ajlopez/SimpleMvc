var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    simplemvc = require('../../');
    
// Create MVC application object

var mvc = simplemvc.createApplication();
    
// Register action with view name, no process

mvc.get('/', 'hello');

// Create the server, register actions and launch it

var server = express.createServer();
server.configure(function() {
  server.use(express.favicon());
  server.use(express.logger());
  server.use(express.router(function(app){
        mvc.registerActions(app);
  }));
  // register the views, view engine
  // an optional third parameter is view options
  // you can use options = { context: globalModelToUseInAllViews; }
  mvc.registerViews(server, path.join(__dirname, 'views'));
});

server.listen(8000);
  
console.log('listening to http://localhost:8000');
