define(function(require , exports , module) {
	var $ = require('jquery');
	var layer = require('../app/common/layer');
	return function(){
		$('#xhs_select_news').bind('change' , function(){
			layer.createLayer();
			var cid		= $("#xhs_select_news option:selected").attr('cid');
			var ctype	= $("#xhs_select_news option:selected").attr('ctype');

			location.href = '/index?cid='+cid+'&ctype='+ctype;
			// $.ajax({
			// 	url			: '/index',
			// 	type		: 'POST',
			// 	data		: {
			// 		cid:cid,
			// 		ctype:ctype
			// 	},
			// 	dataType	: 'html'
			// }).done(function(data){
			// 	layer.allowScroll();
			// 	layer.closeLayer();
			// 	$('#xhs_news_tbody').html('')
			// 	$('#xhs_news_tbody').html(data)
			// }).fail(function(data){
			// 	layer.allowScroll();
			// 	layer.closeLayer();
			// 	console.log(data);
			// });
		});	
		
	}
});
