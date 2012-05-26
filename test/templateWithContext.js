
var $ = require('../lib/template.js')
  , assert = require('assert');
  
function OutputWriter() {
    this.content = '';
};

OutputWriter.prototype.write = function(text)
{
    this.content += text;
};

var context = {};

context.x = "World";
context.y = "Hello";

assert.equal(doTemplate("Hello, ${x}"), "Hello, World");
assert.equal(doTemplate("${y}, ${x}"), "Hello, World");

var result;

context.include = function(text) { result = text; };

doTemplate("<# include('foo'); #>");

assert.equal(result, 'foo');

function doTemplate($text)
{
    var $output = new OutputWriter();
    var $template = $.compileTemplate($text);
    $template($output, null, context);
    return $output.content;
}

