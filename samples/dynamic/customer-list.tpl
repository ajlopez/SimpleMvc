<# include('header', { title: 'Customers' }); #>
<table>
<tr>
<th>Id</th>
<th>Name</th>
</tr>
<# for (var n in model.customers) { 
	var customer = model.customers[n];
#>
<tr>
<td><a href='/customer/${customer.id}'>${customer.id}</a></td>
<td>${customer.name}</td>
</tr>
<# } #>
</table>

<h3>Received Model</h3>
<pre>
${JSON.stringify(model)}
</pre>

<# include('footer'); #>

