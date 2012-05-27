
var fs = require('fs'),
	path = require('path'),
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
                views[name] = tpl;
                return;
            }
            else   
            {
                views[name] = function(model, context) { return viewfn; };
                return;
            }
        }
        else
        {
            views[name] = viewfn;
            return;
        }
    }
	
	this.registerViews = function(app, viewdir, options)
	{
		app.register('.tpl', template);
		app.set('views', viewdir);
		app.set('view engine', 'tpl');
		
		if (options == null)
			options = {};
			
		if (!options.hasOwnProperty('layout'))
			options.layout = isFile(path.join(viewdir, 'layout.tpl'));
		if (!options.hasOwnProperty('context'))
			options.context = defaultContext;
			
		app.set('view options', options);
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
			res.send(err, 500);
            return;
        }
        
        try {
            if (result.view)
            {
                processView(req, res, result.view, result.model, defaultContext);
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
			res.send(ex.toString(), 500);
            return;
        }        
    }
	
	var defaultContext = {};
	
	this.setContext = function(context)
	{
		defaultContext = context;
	}
    
    function processView(req, res, viewname, model, context, ispartial)
    {
		if (context == null)
			context = defaultContext;
		if (model == null)
			model = {};
			
		var viewfn = views[viewname];
		
		if (!viewfn)
		{
			res.render(viewname, model);
			return;
		}
		
		if (typeof model.__include == "undefined")
			model.__include = makeInclude(req, model);

		var result;
		
		result = viewfn(model, context);
		
		if (ispartial)
			res.write(result);
		else
			res.send(result);
			
		function makeInclude(req, model) {
			return function(res, name, ctx)
			{
				processView(req, res, name, model, ctx, true);
			};		
		}
    }
}

exports.createApplication = function() { return new Application(); };

