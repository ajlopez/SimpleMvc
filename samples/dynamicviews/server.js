var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    simplemvc = require('../../');
    
// Create MVC application object

var mvc = simplemvc.createApplication();
    
// Register actions with file view name, no process, and a simple model

mvc.get('/', 'home', { title: 'Home' });
mvc.get('/about', 'about', { title: 'About' });

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

function addCustomer(name)
{
	var customer = { name: name };
	var maxid = 0;
	
	for (var n in customers)
		if (customers[n].id > maxid)
			maxid = customers[n].id;
			
	customer.id = maxid + 1;
	customers.push(customer);
	
	return customer;
}

// Register action for get customers

mvc.get('/customer', function(req, res, next)
    {
		var result = {
			model: {
				title: 'Customers',
				customers: customers
			},
			view: 'customer-list'
		};
		next(req, res, null, result);
    });    

mvc.get('/customer/new', 'customer-new', { title: 'New Customer' });
mvc.post('/customer/new', function(req, res, next) {
	var customer = addCustomer(req.body.name);
	res.redirect('/customer/' + customer.id);
});
	
mvc.get('/customer/:id', function(req, res, next)
    {
		var result = {
			model: {
				title: 'Customer',
				customer: getCustomerById(req.params.id)
			},
			view: 'customer-view'
		};
		next(req, res, null, result);
    });    

mvc.get('/customer/edit/:id', function(req, res, next)
    {
		var result = {
			model: {
				title: 'Edit Customer',
				customer: getCustomerById(req.params.id)
			},
			view: 'customer-edit'
		};
		next(req, res, null, result);
    });    

mvc.post('/customer/edit/:id', function(req, res, next)
    {
		var customer = getCustomerById(req.params.id);
		customer.name = req.body.name;
		res.redirect('/customer/' + customer.id);
    });    

// Create the server, register actions and launch it

var server = express.createServer();
server.configure(function() {
  server.use(express.favicon());
  server.use(express.logger());
  server.use(express.bodyParser());
  server.use('/styles', express.static(path.join(__dirname, '/styles')));
  server.use(express.router(function(app){
        mvc.registerActions(app);
  }));
  // register the views, view engine
  // an optional third parameter is view options
  // you can use options = { context: globalModelToUseInAllViews; }
  mvc.registerViews(server, path.join(__dirname, 'views'));
});

server.listen(8000);
  
console.log('listening to http://localhost:8000');
