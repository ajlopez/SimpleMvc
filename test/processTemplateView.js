
var assert = require('assert'),
    simplemvc = require('../');
    
var application = simplemvc.createApplication();

// Register action by view name

application.get('/', 'home');

// Register view

application.view('home', '1 + 2 == ${1+2}');

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
	output: '',
    write: function(text) { this.output += text},
	send: function(text) { this.output = text},
    end: function() {}
};

app.gets['/'](req, res);

assert.ok(res.output);
assert.equal(res.output, "1 + 2 == 3");

