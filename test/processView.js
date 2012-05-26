
var assert = require('assert'),
    simplemvc = require('../');
    
var application = simplemvc.createApplication();

// Register action by view name

application.get('/', 'home');

// Register view

application.view('home', function(req, res, model, context) {
    req.processed = true;
    res.processed = true;
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
    write: function(text) { this.output = text},
    end: function() {}
};

app.gets['/'](req, res);

assert.ok(req.processed);
assert.ok(res.processed);
assert.equal(typeof res.output, "undefined");


