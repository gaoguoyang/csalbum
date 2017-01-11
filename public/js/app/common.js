var alertIt = function(msg) {
	$('#__alertSuccess').find('strong').text(msg)
	$('#__alertSuccess').modal()
}