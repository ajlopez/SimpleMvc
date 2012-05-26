
function Application()
{
    var gets = {};
    var views = {};
    
    this.get = function(url, action)
    {
        if (typeof action == "string")
            gets[url] = function(req, res, processResult) {
                var result = { view: action };
                processResult(req, res, null, result);
            };
        else
            gets[url] = action;
    };
    
    this.view = function(name, viewfn)
    {
        if (typeof viewfn == 'string')
        {
            views[name] = function(req, res) { res.write(viewfn); res.end(); };
        }
        else
            views[name] = viewfn;
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
            res.write(ex);
            res.end();
            return;
        }        
    }
    
    function processView(req, res, viewname, model, context)
    {
        views[viewname](req, res, model, context);
        res.end();
    }
}

exports.createApplication = function() { return new Application(); };

