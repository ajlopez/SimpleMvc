
var fs = require('fs'),
    template = require('./template.js');

function isFile(filename)
{
    if (filename.indexOf('\n')>=0)
        return false;
    if (filename.indexOf('\r')>=0)
        return false;

    try {
        var stats = fs.lstatSync(filename);
        return stats.isFile();
    }
    catch (err)
    {
        return false;
    }
}

function readFile(filename)
{
    return fs.readFileSync(filename).toString();
}

function Application()
{
    var gets = {};
    var views = {};
    
    this.get = function(url, action)
    {
        if (typeof action == "string")
        {
            gets[url] = function(req, res, processResult) {
                var result = { view: action };
                processResult(req, res, null, result);
            };
            }
        else
            gets[url] = action;
    };
    
    this.view = function(name, viewfn)
    {
        if (typeof viewfn == 'string')
        {
            if (isFile(viewfn))
                viewfn = readFile(viewfn);
                
            if (template.isTemplateText(viewfn))
            {
                var tpl = template.compileTemplate(viewfn);
                views[name] = function(req, res, model, context) {
                    tpl(res, model,context);
                    res.end();
                };
                return;
            }
            else   
            {
                views[name] = function(req, res) { res.write(viewfn); res.end(); };
                return;
            }
        }
        else
        {
            views[name] = viewfn;
            return;
        }
    }
    
    this.registerActions = function(app)
    {
        for (var url in gets)
        {
            var action = gets[url];
            
            app.get(url, function(req, res) { action(req, res, processResult); });
        }
    }
    
    function processResult(req, res, err, result)
    {
        if (err)
        {
            res.write(err);
            res.end();
            return;
        }
        
        try {
            if (result.view)
            {
                processView(req, res, result.view, result.model, result.context);
                return;
            }
            throw "No view";
        }
        catch (ex)
        {
            res.write(ex.toString());
            res.end();
            return;
        }        
    }
    
    function processView(req, res, viewname, model, context)
    {
        var write = res.write;
        res.write = function(value)
        {
            if (value == null)
                return;
            if (typeof value == 'string')
                write.apply(res, [value]);
            else
                write.apply(res, [value.toString()]);
        };
        views[viewname](req, res, model, context != null ? context : {});
        res.end();
    }
}

exports.createApplication = function() { return new Application(); };

