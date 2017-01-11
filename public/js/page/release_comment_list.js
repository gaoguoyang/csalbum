define(function(require , exports , module) {
	var $ = require('jquery');
	var layer = require('../app/common/layer');

	var release_comment_list = function(){
		$('#key_search').bind('focus' , function(){
			$(this).val('');
		});
		$('#weibo_search').bind('focus' , function(){
			$(this).val('');
		});
		$('#key_title').bind('focus' , function(){
			$(this).val('');
		});
		$('#radio-01').bind('click' , function(){
			$('.key').show();
			$('#key_num').show();
			$('#key_search').show();
			$('.category').hide();
			$('#weibo_search').hide();
			$('.news_list').hide();
			$('#key_title').hide();
		});

		$('#radio-03').bind('click' , function(){
			$('.key').show();
			$('#key_num').hide();
			$('#key_search').show();
			$('.category').hide();
			$('#weibo_search').hide();
			$('.news_list').hide();
			$('#key_title').hide();
		});

		$('#radio-04').bind('click' , function(){
			$('.key').show();
			$('#key_num').show();
			$('#key_search').hide();
			$('.category').hide();
			$('#weibo_search').show();
			$('.news_list').hide();
			$('#key_title').hide();
		});

		$('#radio-05').bind('click' , function(){
			$('.category').hide();
			$('.key').show();
			$('#key_num').hide();
			$('#key_search').hide();
			$('#weibo_search').hide();
			$('.news_list').hide();
			$('#key_title').show();
			
		});

		$('#radio-06').bind('click' , function(){
			$('.key').show();
			$('#key_num').show();
			$('#key_search').hide();
			$('.category').hide();
			$('#weibo_search').hide();
			$('.news_list').hide();
			$('#key_title').hide();

			var articleid = $('#article_id').attr('article_id');
			console.log(articleid);
			$('#weibo_search').val(articleid);
		});

		$('body').on('click' ,'#look_comment' ,  function(){
			var newsid = $(this).attr('newsid');
			var type = $(this).attr('type');
			lookCommentByChannel(newsid , type , 1);
			
		});


		$('#radio-02').bind('click' , function(){
			$('.category').show();
			$('.key').hide();
			$('#weibo_search').hide();
			$('.news_list').hide();
			$('#key_title').hide();

			$.ajax({
				url			:'/comment/comment_category',
				type		:'GET',
				dataType	:'json'

			})
			.done(function(data) {
				console.log("get questionBank success");
				$('#category_select').find('option').each(function(index){
					if(index != 0){
						this.remove();
					}
				});
				child = [];
				data.forEach(function(category){
					var domEvent = "<option value='"+category.id+"' >"+category.item.name+"</option>"
					if(!category.leaf){
						var childEvent = '';
						category.child.forEach(function(categoryChild){
							childEvent += "<option value='"+categoryChild.id+"' >"+categoryChild.item.name+"</option>";
						});
						child[category.id] = childEvent;
					}
					$('#category_select').append(domEvent);
					var select_id = $('#category_select').find("option:selected").val()
				});
			})
			.fail(function(data) {
				console.log("get questionBank error");
			});
		});

		$('.search_comment').bind('click' , function(){
			
			var type = $('.radio:checked').val();
			if(type == 'weibo' || type == 'weibo_new'){
				var content = $('#weibo_search').val();
			}else if(type == 'news'){
				layer.createLayer();	
				var title = $.trim($('#key_title').val());
				$.ajax({
					url		: '/comment/getArticleByAnyChannel',
					type	: 'POST',
					dataType: 'html',
					data	: {title:title}
				})
				.done(function(data){
					if(data == ''){
						layer.allowScroll();
						layer.closeLayer();
					}
					$('body').append(data);
				})
				.fail(function(data){
					layer.allowScroll();
					layer.closeLayer();
					console.log('error');
				});
			}else{
				var content = $('#key_search').val();
			}
			var num = $('#key_num').val();
			var page = 1;
			$('#pre_page').hide();
			
			key_search(content , page , num);
			page = 2;
			$('#next_page').attr('page' , page);

		});
		$('#category_select').bind('change' , function(){
			var categoryId = $(this).find("option:selected").val();
			$('#category_select_child').html('<option value="0" >请选择</option>');
			$('#category_select_child').append(child[categoryId]);
			var page = 1;
			$('#pre_page').hide();
			category_search(categoryId , page);

		});
		$('#category_select_child').bind('change' , function(){
			var categoryId = $(this).find("option:selected").val();
			var page = 1;
			$('#pre_page').hide();
			category_search(categoryId , page);

		});

		$('#submit_commit_more').bind('click' , function(){
			var data = [];
			$('input[name="comment"]:checked').each(function(){
				var comment = {};
				comment.id = $(this).val();
				comment.comment = $('#content_'+$(this).val()).html();
				comment.nick = $('#nickname_'+$(this).val()).html();
				data.push(comment);
			});
			data = JSON.stringify(data);
			var articleId = $('#article_id').attr('article_id');

			push_comment(articleId , data);

		});
		$('#submit_commit_one').bind('click' , function(){
			var data = [];
			var comment = {};
			comment.comment = $('#user_comment').val();
			comment.nick = $('#user_nick').val();
			data.push(comment);
			data = JSON.stringify(data);
			var articleId = $('#article_id').attr('article_id');

			push_comment(articleId , data);

			var parent = $('#add_category').find('option:selected').val();
			var child = $('#add_categor_child').find('option:selected').val();


			var data = [];
			var comment = {};
			comment.content = $('#user_comment').val();
			comment.nick = $('#user_nick').val();
			data.push(comment);
			data = JSON.stringify(data);
			if(child){
				$.ajax({
					url			: '/common_comment/add_comment',
					type		: 'POST',
					data		: {
						categoryId:child,
						commentList:data
					},
					dataType	: 'json'
				}).done(function(remotedata){
					$('#user_nick').val('');
					$('#user_comment').val('');
					console.log(remotedata);
				}).fail(function(remotedata){
					console.log(remotedata);
				});
			}

		});
	}

	var category_search = function(categoryId , page){
		
		layer.createLayer();	
		layer.banScroll();	
		$.ajax({
				url			: '/comment/category_comment?categoryId='+categoryId+'&page='+page,
				type		: 'GET',
				dataType	: 'html'
			})
			.done(function(data){
				$('#comment_list').html('')
				$('#comment_list').html(data);
				$('.page').attr('search' , categoryId).attr('type' , 'category');
				layer.allowScroll();
				layer.closeLayer();
			})
			.fail(function(){
				layer.allowScroll();
				layer.closeLayer();
				console.log('error');
			});
	}

	var key_search = function(content , page , num){
		
		var type = $('.radio:checked').val();
		layer.createLayer();	
		layer.banScroll();	
		
		var url = '/comment/search_comment?content='+content+'&page='+page+'&type='+type+'&num='+num;
		$.ajax({
				url			: url,
				type		: 'GET',
				dataType	: 'html'
			})
			.done(function(data){
				$('#comment_list').html('')
				$('#comment_list').html(data);
				$('.page').attr('search' , content).attr('type' , 'key').attr('num' , num);;
				layer.allowScroll();
				layer.closeLayer();

			})
			.fail(function(){
				layer.allowScroll();
				layer.closeLayer();
				console.log('error');
			});
	}

	var lookCommentByChannel = function(newsid , type , page){
	
		$.ajax({
				url		:"/comment/channelCommentList?newsid="+newsid+"&type="+type+"&page="+page,
				type	:'GET',
				datatype:'html'
			})
			.done(function(data){
				layer.allowScroll();
				layer.closeLayer();
				$('.modal').hide()
				$('#comment_list').append(data);
				$('.page').attr('type' , type);
				$('.page').attr('newsid' , newsid);
				$('.page').attr('page' , parseInt(page)+1);
			})
			.fail(function(data){
				layer.allowScroll();
				layer.closeLayer();
			});
	}


	var push_comment = function(articleId , data){
		layer.createLayer();	
		layer.banScroll();	
		$.ajax({
		  url		: '/comment/push_comment',
		  type		: 'POST',
		  data		: {
				articleId:articleId,
				commentList:data
		  },
		  dataType	: 'html'
		})
		.done(function(data){
			layer.allowScroll();
			layer.closeLayer();
			$('#user_nick').val('');
			$('#user_comment').val('');
			$('body').append(data);
			$('input[name="comment"]:checked').attr('checked' , false);
		})
		.fail(function(data){
			layer.allowScroll();
			layer.closeLayer();
            console.log('error');
		});


	}

	$('#next_page').bind('click' , function(){
		var _this = this;
		var type = $(_this).attr('type');
		var content = $(_this).attr('search');
		var page = $(_this).attr('page');
		var num = $(_this).attr('num');
		if(type == 'key'){

			key_search(content , page , num);
		}else if(type == 'news'){
			var newsid = $(_this).attr('newsid');
			lookCommentByChannel(newsid , type , page);
		}else{
			
			category_search(content , page);
		}
		var tmp_page = parseInt(Number(page) - 1);

		if(tmp_page == 0 ){
			$('#pre_page').attr('page', 1);
		}else{
			$('#pre_page').attr('page', tmp_page);
		}
		$(_this).attr('page', parseInt(Number(page) + 1));
		$('#pre_page').show();
	});
	$('#pre_page').bind('click' , function(){
		var _this = this;
		var type = $(_this).attr('type');
		var content = $(_this).attr('search');
		var page = $(_this).attr('page');
		var num = $(_this).attr('num');
		if(type == 'key'){
			
			key_search(content , page , num);
		}else if(type == 'news'){
			var newsid = $(_this).attr('newsid');
			lookCommentByChannel(newsid , type , page);
		}else{
			
			category_search(content , page);
		}
		$('#next_page').attr('page' , parseInt(Number(page) + 1));
		if(page <= 1){
			$(_this).hide();
		}else{
			var tmp_page = parseInt(Number(page) - 1);
			if(tmp_page == 0){
				$(_this).attr('page' , 1);
			}else{
				$(_this).attr('page' , tmp_page);
			}
		}
	});

	$('body').on('click' , '.close' , function(){
		$('.modal').hide()
		layer.allowScroll();
		layer.closeLayer();
	});
	$('body').on('click' , '.close_ok' , function(){
		$('.modal').hide()
		layer.allowScroll();
		layer.closeLayer();
	});

	//编辑评论全选
	$('#all_checkbox').bind('click' , function(){
		$("input[name='comment']").prop('checked' , true);	
	});
	//查看评论全选
	$('#look_all_checkbox').bind('click' , function(){
		$("input[name='comment']").prop('checked' , true);	
	});
	//编辑评论全不选
	$('#all_not_checkbox').bind('click' , function(){
		$("input[name='comment']").prop('checked' , false);	
	});
	//查看评论全不选
	$('#look_all_not_checkbox').bind('click' , function(){
		$("input[name='comment']").prop('checked' , false);	
	});

	$('#add_category').bind('change' , function(){
	
		$('#add_categor_child').find('option').prop('selected' , false).hide();
		var parent = $(this).find('option:selected').val();
		$('#add_categor_child').find('option[value=0]').prop('selected' , true);
		$('option[parent="'+parent+'"]').show();
	});

	exports.release_comment_list = release_comment_list;

});
