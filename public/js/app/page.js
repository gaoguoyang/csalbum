define(function(require , exports , module) {
	var $ = require('jquery');
	return function(){
		var page_div = $('<div></div>');				
		page_div.append('<ul></ul>');

		var li = $('<li></li>');
		var a = $('<a></a>');
		var href = "";

		var options = {
			page		: 1,
			total		: 10,
			pageNum		: 10
		}

		if(options.pageNum < 5){
			
		}
	}
});
