
var $ = require('../lib/template.js')
  , assert = require('assert');
  
var context = {};

context.x = "World";
context.y = "Hello";

assert.equal(doTemplate("Hello, ${x}"), "Hello, World");
assert.equal(doTemplate("${y}, ${x}"), "Hello, World");

var result;

context.include = function(text) { result = text; };

doTemplate("<# include('foo'); #>");

assert.equal(result, 'foo');

function doTemplate(text)
{
    var template = $.compileTemplate(text);
    return template(null, context);
}

