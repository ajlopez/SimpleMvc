<# include('header', { title: 'Edit Customer' }); #>
<div class='actions'>
<a href='/customer/${model.customer.id}'>View Customer</a>
</div>

<form method='post'>
<fieldset>
	<div class="editor-label">
	Name
	</div>
	<div class="editor-field">
	<input type='text' name='name' value='${model.customer.name}'/>
	</div>
	<div class="editor-field">
	<input type='submit' value='Accept'/>
	</div>
</fieldset>
</form>

<# include('footer'); #>
