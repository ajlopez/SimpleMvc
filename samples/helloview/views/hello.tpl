<h1>Hello, world</h1>

<p>I'm a template</p>

<#
    for (var k = 1; k <= 6; k++) {
#>
<h2>Message ${k}</h2>
<#
    }
#>

<h3>Current time ${new Date()}</h3>

