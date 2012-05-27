
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
    var posts = {};
    var views = {};
    
    this.get = function(url, action)
    {
        if (typeof action == "string")
        {
			var fn = makeProcess(action);
			fn.actionName = action;
            gets[url] = fn;
        }
        else
            gets[url] = action;
			
		function makeProcess(action) {
			return function(req, res) {
				processResult(req, res, null, { view: action });
			};
		}
    };
    
    this.post = function(url, action)
    {
        if (typeof action == "string")
        {
			var fn = makeProcess(action);
			fn.actionName = action;
            posts[url] = fn;
        }
        else
            posts[url] = action;
			
		function makeProcess(action) {
			return function(req, res) {
				processResult(req, res, null, { view: action });
			};
		}
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
                    tpl(res, model, context);
                };
                return;
            }
            else   
            {
                views[name] = function(req, res) { res.write(viewfn); };
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
            app.get(url, makeAction(action));
			
			function makeAction(action) {
				return function(req, res) { action(req, res, processResult); };
			}
        }

        for (var url in posts)
        {
            var action = posts[url];            
            app.post(url, makeAction(action));
			
			function makeAction(action) {
				return function(req, res) { action(req, res, processResult); };
			}
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
			if (result.redirect)
			{
				res.redirect(result.redirect);
				res.end();
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
    
    function processView(req, res, viewname, model, context, ispartial)
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
		
		if (context == null)
			context = {};
			
		if (typeof context.include == "undefined")
			context.include = function(name, ctx)
			{
				processView(req, res, name, model, ctx, true);
			};
			
        views[viewname](req, res, model, context != null ? context : {});
		
		if (!ispartial)
			res.end();
    }
}

exports.createApplication = function() { return new Application(); };

