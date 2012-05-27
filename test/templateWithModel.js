
var $ = require('../lib/template.js')
  , assert = require('assert');
  
function OutputWriter() {
    this.content = '';
};

OutputWriter.prototype.write = function(text)
{
    this.content += text;
};

assert.equal(doTemplate("Hello, World"), "Hello, World");

var model = {};
var context = {};

model.x = "World";
model.y = "Hello";

assert.equal(doTemplate("Hello, ${x}"), "Hello, World");
assert.equal(doTemplate("${y}, ${x}"), "Hello, World");

context.x = "Mundo";
context.z = "Hola";
assert.equal(doTemplate("${z}, ${x}"), "Hola, World");

function doTemplate($text)
{
    var $output = new OutputWriter();
    var $template = $.compileTemplate($text);
    $template($output, model, context);
    return $output.content;
}

