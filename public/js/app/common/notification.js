var notify;
var one = $('#notify_one');
var two = $('#notify_two');
var three = $('#notify_three');
$(document).ready(function() {
	notify = function(){
		$.ajax({
			url			: '/notify',
			type		: 'POST',
			data		: {},
			dataType	: 'html'
		}).done(function(data){
			console.log('notify',data);
			var res = JSON.parse(data).result;
			update_notifyNum(one,res['1_10']);
			update_notifyNum(two,res['11_20']);
			update_notifyNum(three,res['21_30']);
		}).fail(function(data){
			console.log(data);
		});
	}
	setInterval("notify()", 30000);
	notify();

	$('#dropdown_three').on('click', function(event) {
		 $('html,body').animate({scrollTop:$('#newsItem_20').offset().top},200);
	});
	$('#dropdown_two').on('click', function(event) {
		 $('html,body').animate({scrollTop:$('#newsItem_10').offset().top},200);
	});
	$('#dropdown_one').on('click', function(event) {
		 $('html,body').animate({scrollTop:$('#main-content').offset().top},200);
	});

});

function update_notifyNum(item,content) {
	if(content == '0'){
		item.html('');
	} else {
		item.html(content);
	}
}