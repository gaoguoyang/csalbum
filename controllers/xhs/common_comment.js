/*
	评论管理
	by wuhui
 */
var express = require('express');
var router = express.Router();
var remoteRequest = require('libs/remoteRequest');


//获取评论的分类
router.get('/common_comment_list' , function(req , res , next){
	var baseRequest = remoteRequest(req , res);

	var url = '/basecomment/getCategory';

	var data = req.body;
	var open  = req.query;

	baseRequest.post(url , data , function(err , response , body){
		var jsonStr = JSON.parse(body);
		if(open){
			jsonStr.open = open.id;
		}else{
			jsonStr.open = jsonStr.result[0].id;
		}
		if('SUCCESS' == jsonStr.code || 'RESULT_EMPTY' == jsonStr.code){
			res.render('xhs/comment/common_comment_list' , jsonStr);
		}else{
			res.redirect('/login');
		}
	});
});


//添加评论
router.post('/add_comment' , function(req , res , next){
	var baseRequest = remoteRequest(req , res);

	var url = '/basecomment/addComment';

	var data = req.body;
	data.commentList = JSON.parse(data.commentList);

	console.log(data);
	baseRequest.post(url , data , function(err , response , body){
		var jsonStr = JSON.parse(body);

		if('LOGIN_FAILED' == jsonStr.code){
			res.redirect('/login');
		}

		if('SUCCESS' == jsonStr.code || 'RESULT_EMPTY' == jsonStr.code){
			var data = {
				'title' : "添加评论",
				'content' : "添加成功"
			}
			res.render('xhs/common/success' , data , function(err , html){
				res.end(JSON.stringify(html))
			});
		}
	});
});

//添加评论
router.post('/add_category' , function(req , res , next){
	var baseRequest = remoteRequest(req , res);

	var url = '/basecomment/addCategory';

	var data = req.body;

	baseRequest.post(url , data , function(err , response , body){
		var jsonStr = JSON.parse(body);
		if('SUCCESS' == jsonStr.code ){
			data.oldparent = data.parent;
			data.parent = jsonStr.result;
			if(data.oldparent == 0){
				res.render('xhs/comment/parent_category' , data , function(err , html){
					console.log(html);
					res.send(html);
				});
			}else{
				res.render('xhs/comment/child_category' , data , function(err , html){
					res.send(html);
				});
			}
		}else{
			res.redirect('/common_comment/common_comment_list');
		}
	});	
});

module.exports=router
