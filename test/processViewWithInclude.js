
var assert = require('assert'),
    simplemvc = require('../');
    
var application = simplemvc.createApplication();

// Register action by view name

application.get('/', 'home');
application.get('/home2', 'home2');

// Register view

application.view('home', '<# include("header"); include("footer"); #>');
application.view('header', 'Hello, ');
application.view('footer', 'world');

// Register view that uses includes with parameters

application.view('home2', '<# include("message", { message: "Hello, " }); include("message", { message: "World, with include context" }); #>');
application.view('message', '${message}');

var app = {
    gets: {},
    get: function(url, fn)
    {
        this.gets[url] = fn;
    }
};

application.registerActions(app);

assert.ok(app.gets['/']);
assert.ok(app.gets['/home2']);
assert.notEqual(app.gets['/'], app.gets['/home2']);
assert.equal(typeof app.gets['/'], 'function');
assert.equal(typeof app.gets['/home2'], 'function');

var req = {};
var res = {
	output: '',
    write: function(text) { this.output += text},
	send: function(text) { this.output = text; this.endcalled = true; },
    end: function() { this.endcalled = true; }
};

app.gets['/'](req, res);

assert.ok(res.output);
assert.equal(res.output, "Hello, world");

var res2 = {
	output: '',
    write: function(text) { this.output += text},
	send: function(text) { this.output = text; this.endcalled = true; },
    end: function() { this.endcalled = true; }
};

app.gets['/home2'](req, res2);

assert.ok(res2.output);
assert.equal(res2.output, "Hello, World, with include context");

