var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    simplemvc = require('../../');
    
// Create MVC application object

var mvc = simplemvc.createApplication();
    
// Register action with file view name, no process

mvc.get('/', 'hello');

// Register view as string

mvc.view('hello', path.join(__dirname, 'hello.html'));

// Create the server, register actions and launch it

express.createServer()
  .use(express.favicon())
  .use(express.logger())
  .use(express.router(function(app){
		mvc.registerActions(app);
  })).listen(8000);
  
console.log('listening to http://localhost:8000');
