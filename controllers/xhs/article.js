/*
   文章管理
   by wuhui
   */
var express = require('express');
var router = express.Router();
var remoteRequest = require('libs/remoteRequest');
var remote = require('libs/remote');
var moment = require('moment');

/* 进入文章管理界面 */
router.get('/article_list' , function(req , res , next) {
    var baseRequest = remoteRequest(req , res);

    var url = '/article/getArticleListByDate';

    var data = {
        publisDate:moment().format('YYYY-MM-DD')
    };

    if(req.query.publisDate){
        data.publisDate = req.query.publisDate;
    }

    baseRequest.post(url , data , function(err , response , body){
        var jsonStr = JSON.parse(body);
		
		jsonStr.day = data.publisDate;
		jsonStr.openmenu = 'article';
		jsonStr.selectmenu = 'article_list';
        // console.log(jsonStr);
        if('SUCCESS' == jsonStr.code || 'RESULT_EMPTY' == jsonStr.code){
            res.render('xhs/article/articleManage_list' , jsonStr);
        }else{
            res.redirect('/login');
        }
    });
});

//ajax 已发布的文章管理
router.post('/article_list' , function(req , res , next) {
    var baseRequest = remoteRequest(req , res);

    var url = '/article/getArticleListByDate';

	var data = req.body;
    console.log(data);

    baseRequest.post(url , data , function(err , response , body) {
        var jsonStr = JSON.parse(body);
		jsonStr.day = data.publisDate;

        jsonStr.openmenu = 'article';
        jsonStr.selectmenu = 'article_list';
        if('SUCCESS' == jsonStr.code || 'RESULT_EMPTY' == jsonStr.code){
   //          res.render('xhs/article/ajax_article_list' , jsonStr , function(err , html){
			// 	res.send(html);
			// });
            console.log(jsonStr);
            res.render('xhs/article/articleManage_list' , jsonStr);
        }else{
            res.redirect('/login');
        }
    });
});


/*绩效管理*/
router.get('/jixiao', function(req, res, next) {
    // var baseRequest = remoteRequest(req , res);
    var info = req.query;
    var url = '/selectCommentJnl';

    info.nickName = '1';
	info.createTime = moment().format('YYYY-MM-DD');
    //var selectData
   
    var options = {
        'commentList' : {
            'url':'/httpclient/selectCommentJnl',
            'data':{
                userId      :info.nickName,
                // addDate     :'2015-09-24',
                addDate     :info.createTime,
                articleid   :'',
                content     :'',
                page        :info.page,
                num         :"50"
            },
            'method':'POST'

        },
        'userList' : {
            'url':'/httpclient/getAllAdminUserList',
            'data':{},
            'method':'POST'
        }
    }

    remote(req , res , options , function(data){
        data['userInfo'] = data.commentList.userInfo;
		data['day'] = info.createTime;
		data['openmenu'] = 'article';
		data['selectmenu'] = 'jixiao';

        console.log(data);
        res.render('xhs/article/jixiao' , data);
    });

});


/*绩效管理 ajax*/
router.post('/jixiao', function(req, res, next) {
    var baseRequest = remoteRequest(req , res);
    var info = req.body;
    var url = '/selectCommentJnl';
    var data = {
        userId      :info.nickName,
        addDate     :info.createTime,
        articleid   :info.articleid,
        content     :info.content,
        page        :info.page,
        num         :info.num
    };

    baseRequest.post(url , data , function(err , response , body){
        var jsonStr = JSON.parse(body);
        jsonStr.userId = info.nickName;
        jsonStr.addDate = info.createTime;
        jsonStr.articleid = info.articleid;
        jsonStr.content = info.content;
        console.log(jsonStr);
        if('SUCCESS' == jsonStr.code || 'RESULT_EMPTY' == jsonStr.code){
            res.render('xhs/article/ajax_jixiao_list' , jsonStr , function(err , html){
                res.send(html);
            });
        }else{
            res.redirect('/login');
            // var json = JSON.stringify();
        }
    });
});





/*文章管理*/
router.get('/adminUserList', function(req, res, next) {
    var baseRequest = remoteRequest(req , res);
    var url = '/getAllAdminUserList';
    var data = {
        // userId		:"1",
        // addDate		:"2015-08-19",
        // pageIndex	:"0",
        // pageCount	:"50"
    };
    baseRequest.post(url , data , function(err , response , body){
        var jsonStr = JSON.parse(body);
        // res.end();
        if('SUCCESS' == jsonStr.code || 'RESULT_EMPTY' == jsonStr.code){
            res.render('xhs/article/adminUserList' , jsonStr);
        }else{
            res.redirect('/login');
        }
    });
});





module.exports = router;
