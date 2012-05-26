
var $ = require('../lib/template.js')
  , assert = require('assert');
  
assert.ok(!$.isTemplateText());
assert.ok(!$.isTemplateText(null));
assert.ok(!$.isTemplateText("Hello, world"));
assert.ok(!$.isTemplateText("<h1>Hello, world</h1>"));

assert.ok($.isTemplateText("1 + 2 = ${1+2}"));
assert.ok($.isTemplateText("<#var x = 'My World'; #>Hello, ${x}"));
assert.ok($.isTemplateText("<#for (var k=1; k<=6; k++) writer.write(k);#>"));

