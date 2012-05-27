
var assert = require('assert'),
    simplemvc = require('../');
    
var application = simplemvc.createApplication();

// Register action by view name

application.get('/', 'home');

// Register view

application.view('home', function(model, context) {
	return 'Hello, world';
});

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
	send: function(text) { this.output = text; this.endcalled = true; },
    end: function() { this.endcalled = true; }
};

app.gets['/'](req, res);

assert.equal(res.output, 'Hello, world');
assert.ok(res.endcalled);

