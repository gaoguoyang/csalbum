define(function(require , exports , module) {
	var $ = require('jquery');
	var layer = require('../app/common/layer');


	
	// 搜索条件
	var search = function(page){
	    var nickName = $('.AdminId').val();
	    var coment = $('.coment').val();
	    var comentId = $('.coment-id').val();
	    var createTime = $('.form_date').val();
	    if(nickName == "0" && createTime =="请选择时间"){
	        alert("请选择时间和昵称");
	        return;
	    }
	    layer.createLayer();
	    $.post('/article/jixiao', {nickName: nickName,createTime: createTime,articleid: comentId,content:coment,page:page,num:50 }, function(data) {    
	    	layer.allowScroll();
			layer.closeLayer();
	        $('#jixiao').html('');
	        $('#jixiao').html(data);
	    });
	}


	$('.submit_action').click(function (){
	    search(1);
	});


	//下一页
	$('#next_page').click(function (){
	    var page = $('#next_page').attr('page');
	    var pre_page = $('#pre_page').attr('page');
	    $('#next_page').attr('page',parseInt(Number(page) + 1));
	    $('#pre_page').attr('page',parseInt(Number(pre_page) + 1));

	    var page = $('#next_page').attr('page');
	    if(page != 1){
	        $('#pre_page').removeAttr("style");
	    }
	    search(page);
	});

	//上一页
	$('#pre_page').click(function (){
	    var next_page = $('#next_page').attr('page');
	    $('#pre_page').attr('page',parseInt(Number(next_page) - 1));
	    $('#next_page').attr('page',parseInt(Number(next_page) - 1));

	    var page = $('#pre_page').attr('page');
	    if(page <= 1){
	        $('#pre_page').attr('style',"display:none");
	        $('#pre_page').attr('page',1);
	        $('#next_page').attr('page',2);
	    }
	    search(page);
	});





	exports.search = jixiao;

});