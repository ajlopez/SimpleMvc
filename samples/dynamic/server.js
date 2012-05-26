var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    simplemvc = require('../../');
    
// Create MVC application object

var mvc = simplemvc.createApplication();
    
// Register actions with file view name, no process

mvc.get('/', 'home');
mvc.get('/about', 'about');

// Customers

var customers = [
	{ id: 1, name: "Microsoft" },
	{ id: 2, name: "Apple" },
	{ id: 3, name: "Google" }
];

function getCustomerById(id)
{
	for (var n in customers)
	{
		if (customers[n].id == id)
			return customers[n];
	}
}

// Register action for get customers

mvc.get('/customer', function(req, res, next)
    {
		var result = {
			model: {
				customers: customers
			},
			view: 'customer-list'
		};
		next(req, res, null, result);
    });    

mvc.get('/customer/:id', function(req, res, next)
    {
		var result = {
			model: {
				customer: getCustomerById(req.params.id)
			},
			view: 'customer-view'
		};
		next(req, res, null, result);
    });    

// Register views

mvc.view('home', path.join(__dirname, 'home.tpl'));
mvc.view('about', path.join(__dirname, 'about.tpl'));
mvc.view('customer-list', path.join(__dirname, 'customer-list.tpl'));
mvc.view('customer-view', path.join(__dirname, 'customer-view.tpl'));

// Register partial views to be included

mvc.view('header', path.join(__dirname, 'header.tpl'));
mvc.view('footer', path.join(__dirname, 'footer.html'));

// Create the server, register actions and launch it

express.createServer()
  .use(express.favicon())
  .use(express.logger())
  .use('/styles', express.static(path.join(__dirname, '/styles')))
  .use(express.router(function(app){
		mvc.registerActions(app);
  })).listen(8000);
  
console.log('listening to http://localhost:8000');
