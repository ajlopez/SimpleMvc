<div class='actions'>
<a href='/customer/new'>New Customer</a>
</div>

<table>
<tr>
<th>Id</th>
<th>Name</th>
</tr>
<# for (var n in customers) { 
	var customer = customers[n];
#>
<tr>
<td><a href='/customer/${customer.id}'>${customer.id}</a></td>
<td>${customer.name}</td>
</tr>
<# } #>
</table>

<h3>Received Model</h3>
<pre>
<#
	for (var n in model)
	{
		writer.write(n);
		writer.write(": ");
		if (typeof model[n] == 'function')
			writer.write('[Function]');
		else
			try {
				writer.write(JSON.stringify(model[n]));
			}
			catch (ex)
			{
				writer.write('[No JSON]');
			}
		writer.write('\n');
	}
#>
</pre>

