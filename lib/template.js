
function compileCode(text, values)
{
    var pos = text.indexOf("<#");
    
    if (pos < 0)
    {        
        var l = values.length;
        values.push(text);
       
        return "writer.write($values[" + l + "]);";
    }
        
    var code = '';
        
    var left = text.slice(0, pos);
    
    if (left)
        code = compileToCode(left, values);

	var text = text.slice(pos + 2);
    var pos2 = text.indexOf("#>");
    
    var cmd = text.slice(0, pos2);
    
    code += cmd;
    
    var right = text.slice(pos2 + 2);
    
    if (right)
        code += compileToCode(right, values);
        
    return code;
}

function compileToCode(text, values)
{
    var pos = text.indexOf("${");
    
    if (pos < 0)
        return compileCode(text, values);
        
    var code = '';
        
    var left = text.slice(0, pos);
    
    if (left)
        code = compileCode(left, values);
    
	text = text.slice(pos + 2);
    var pos2 = text.indexOf("}");
    
    var expr = text.slice(0, pos2);
	
    code += "writer.write(" + expr +");";
    
    var right = text.slice(pos2 + 1);
    
    if (right)
        code += compileToCode(right, values);
        
    return code;
}

function TemplateWriter() {
	this.output = '';
};

TemplateWriter.prototype.write = function(text)
{
	if (text == null)
		return;
	this.output += text;
};

TemplateWriter.prototype.send = function(text)
{
	this.output = text;
};

function compileTemplate($text) {
    var $values = [];
    var $code = compileToCode($text, $values);
    var fun = new Function("writer", "model", "context", "$values", "function include(name, newmodel) { model.__include(writer, name, newmodel); } with (context) with (model) {" + $code + "}");
    return function(model, context) { 
		var writer = new TemplateWriter();
		fun(writer, model == null ? {} : model, context == null ? {} : context, $values); 

		return writer.output;
	}
};

exports.compileTemplate = compileTemplate;

function isTemplateText(text)
{
    if (text == null)
        return false;
    if (text.indexOf('<#')>=0)
        return true;
    if (text.indexOf('${')>=0)
        return true;
    return false;
}

exports.isTemplateText = isTemplateText

exports.compile = function(str, options)
{
	if (!isTemplateText(str))
		return function(model) { return str; };
		
	var fn = compileTemplate(str);

	return function(model) {
		return fn(model, options.context);
	}
}

