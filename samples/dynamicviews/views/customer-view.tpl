<div class='actions'>
<a href='/customer/edit/${customer.id}'>Edit Customer</a>
</div>
<fieldset>
	<div class="display-label">
	Id
	</div>
	<div class="display-field">
	${customer.id}
	</div>
	<div class="display-label">
	Name
	</div>
	<div class="display-field">
	${customer.name}
	</div>
</fieldset>

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

