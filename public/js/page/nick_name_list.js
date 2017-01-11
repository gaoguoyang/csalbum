define(function(require , exports , module) {
	var $ = require('jquery');
	var layer = require('../app/common/layer');
	return function(){
		//全选
		$('#all_checkbox').bind('click' , function(){
			$('input[name="nick"]').prop('checked' , true);	
		});
		
		//反选
		$('#all_not_checkbox').bind('click' , function(){
			$('input[name="nick"]').prop('checked' , false);	
		});

		//单选
		$('.more_check').bind('click', function(){
			var data = [];
			var flag = $(this).attr('flag');
			$('input[name="nick"]:checked').each(function(idx , obj){
				var check_id = $(obj).val();
				var nickList = {};
				nickList.id = $('#id_'+check_id).html();
				nickList.flag = flag;
				data.push(nickList);
			});
			data = JSON.stringify(data);
			change_nick(data);
		});


		$('.check').bind('click', function(){
			var data = [];
			var flag = $(this).attr('flag');
			var check_id = $(this).attr('id');
			var nickList = {};
			nickList.id = $('#id_'+check_id).html();
			nickList.flag = flag;
			data.push(nickList);
			data = JSON.stringify(data);
			change_nick(data);
		});

		var change_nick = function(data){
			$.ajax({
				url:'/user/filterNick',
				dataType:'html',
				type:'POST',
				data:{
					'nickList' : data
				},
			})
			.done(function(data){
				$('body').append(data);
			})
			.fail(function(data){
				console.log(data);
			});
		}

		$('body').on('click' , '.close' , function(){
			$('.modal').hide();
			layer.allowScroll();
			layer.closeLayer();
			window.location.reload();
		});
		$('body').on('click' , '.close_ok' , function(){
			$('.modal').hide();
			layer.allowScroll();
			layer.closeLayer();
			window.location.reload();
		});
	}
});
