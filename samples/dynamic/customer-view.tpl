<# include('header', { title: 'Customer' }); #>
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
${JSON.stringify(model)}
</pre>

<# include('footer'); #>

