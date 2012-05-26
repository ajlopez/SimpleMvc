
var assert = require('assert'),
    path = require('path'),
    simplemvc = require('../');
    
var application = simplemvc.createApplication();

// Register action by view name

application.get('/', 'home');

// Register view

application.view('home', path.join(__dirname, 'files/hello.html'));

var app = {
    gets: {},
    get: function(url, fn)
    {
        this.gets[url] = fn;
    }
};

application.registerActions(app);

var req = {};
var res = {
    write: function(text) { this.output = text},
    end: function() {}
};

app.gets['/'](req, res);

assert.ok(res.output);
assert.ok(res.output.indexOf("Hello, world") >= 0);

