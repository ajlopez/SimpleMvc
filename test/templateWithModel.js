
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

model.x = "World";
model.y = "Hello";

assert.equal(doTemplate("Hello, ${model.x}"), "Hello, World");
assert.equal(doTemplate("${model.y}, ${model.x}"), "Hello, World");

function doTemplate($text)
{
    var $output = new OutputWriter();
    var $template = $.compileTemplate($text);
    $template($output, model, {});
    return $output.content;
}

