define(function(require , exports , module) {
	var $ = require('jquery');

	var createLayer = function(){
		var layer = $('<div></div>');
		layer.attr('id' , 'layer');
		layer.css({
			'position'	: 'fixed',
			'top'		: '0',
			'left'		: '0',
			'width'		: '100%',
			'height'	: '100%',
			'z-index'	: '2001',
			'background-color':'rgba(0,0,0,0.7)'
		});

		var loadImg = $('<img>');

		loadImg.attr('src' , '/img/layer.gif');

		loadImg.css({
		    position		: 'absolute',
		    top				: '50%',
		    left			: '50%',
		    width			: '124px',
		    height			: '124px',
		    'margin-left'	: '-62px',
		    'margin-top'	: '-62px',
		    'overflow'		: 'auto'
		});

		$('body').append(layer);
		layer.append(loadImg);

	}

	var closeLayer = function(){
		$('#layer').remove();
	}

	var banScroll = function(){
	
		var scrollFunc=function(e){
			e=e||window.event;
			if (e&&e.preventDefault){
				e.preventDefault();
				e.stopPropagation();
			}else{ 
				e.returnvalue=false;  

				return false;     
			}
		}

		$('body').bind('mousewheel', function(e){
			scrollFunc(e);
		});
		//火狐下的鼠标滚动事件
		$('body').bind('DOMMouseScroll', function(e){
			scrollFunc(e);
		});
	}

	var allowScroll = function(){
		$('body').unbind('mousewheel');
		$('body').unbind('DOMMouseScroll');
	}


	exports.createLayer = createLayer;
	exports.closeLayer = closeLayer;
	exports.banScroll = banScroll;
	exports.allowScroll = allowScroll;

});
