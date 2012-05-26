<# include('header', { title: 'Customer' }); #>
<fieldset>
	<div class="display-label">
	Id
	</div>
	<div class="display-field">
	${model.customer.id}
	</div>
	<div class="display-label">
	Name
	</div>
	<div class="display-field">
	${model.customer.name}
	</div>
</fieldset>

<h3>Received Model</h3>
<pre>
${JSON.stringify(model)}
</pre>

<# include('footer'); #>

