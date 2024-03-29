
var assert = require('assert'),
    simplemvc = require('../');
    
var application = simplemvc.createApplication();

application.get('/', function(req, res, next)
    {
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

assert.ok(app.gets['/']);
assert.equal(typeof app.gets['/'], "function");

var req = {};
var res = {};

app.gets['/'](req, res);

assert.ok(req.processed);
assert.ok(res.processed);

