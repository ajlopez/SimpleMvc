
var assert = require('assert'),
    simplemvc = require('../');
    
var application = simplemvc.createApplication();

application.post('/', function(req, res, next)
    {
        req.processed = true;
        res.processed = true;
    });
    
var app = {
    posts: {},
    post: function(url, fn)
    {
        this.posts[url] = fn;
    }
};

application.registerActions(app);

assert.ok(app.posts['/']);
assert.equal(typeof app.posts['/'], "function");

var req = {};
var res = {};

app.posts['/'](req, res);

assert.ok(req.processed);
assert.ok(res.processed);

