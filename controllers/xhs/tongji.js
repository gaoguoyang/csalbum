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
router.get('/zongliang', function(req, res, next) {

	var options = {
		'userInfo'		: {
			'url'	: '/httpclient/adminUser/getCurrentUser',
			'data'	: '',
			'method': 'POST'
		},
		'allDayComments'		: {
			'url'	: '/httpclient/getLocalEverydayCommentsNums',
			'data'	: '',
			'method': 'post'
		},
		'todayComments'		: {
			'url'	: '/httpclient/getTodayCommentsNums',
			'data'	: '',
			'method': 'post'
		},
		'todayXHSComments'		: {
			'url'	: '/httpclient/getTodayxhsNums',
			'data'	: '',
			'method': 'post'
		}
	};

	remote(req , res , options , function(data){
		data.userInfo = data.userInfo.userInfo;
		res.render('xhs/tongji/zongliang' , data );
	});

});




//占比统计
router.get('/persent', function(req, res, next) {
    // var baseRequest = remoteRequest(req , res);
    var info = req.query;
    var url = '/calculate/getPercent';
	// info.dateTime = dateTime().format('YYYY-MM-DD');
    //var selectData
   // dateTime = '2015-09-28';
    dateTime='';
    var options = {
        'commentList' : {
            'url':'/httpclient/calculate/getPercent',
            'data':{
                date:dateTime,
            },
            'method':'POST'
        },
        'userInfo'	: {
			'url'	: '/httpclient/adminUser/getCurrentUser',
			'data'	: '',
			'method': 'POST'
		},
    }

    remote(req , res , options , function(data){
    	data.day = data.userInfo.date;
    	data.userInfo = data.userInfo.userInfo;
    	data.day = moment().format('YYYY-MM-DD');
        console.log(data.commentList);
        res.render('xhs/tongji/persent' , data);
    });
});


//占比统计ajax数据
router.post('/persent', function(req, res, next) {
    var baseRequest = remoteRequest(req , res);
    var info = req.body;
    console.log(info.dateTime);
    var url = '/calculate/getPercent';
    var data = {
         date:info.dateTime,
    };
    baseRequest.post(url , data , function(err , response , body){
        var jsonStr = JSON.parse(body);
        // res.end();
        console.log(jsonStr);
        if('SUCCESS' == jsonStr.code || 'RESULT_EMPTY' == jsonStr.code){
             res.render('xhs/tongji/ajax_persent_list' , jsonStr , function(err , html){
             	console.log(html)
             	res.send(html);
             });
        }else{
            // res.redirect('/login');
        }
       
    });
});


//每日绩效
router.get('/report', function(req, res, next) {
    var info = req.query;
    info.dateTime = moment().format('YYYY-MM-DD');
    var options = {
        'reportList' : {
            'url':'/httpclient/report/getCommentReport',
            'data':{
                date:info.dateTime,
            },
            'method':'POST'
        },
        'userInfo'  : {
            'url'   : '/httpclient/adminUser/getCurrentUser',
            'data'  : '',
            'method': 'POST'
        },
    }
    remote(req , res , options , function(data){
        data.day = data.userInfo.date;
        data.userInfo = data.userInfo.userInfo;
        data.day = moment().format('YYYY-MM-DD');
        console.log(data.reportList);
        res.render('xhs/tongji/report' , data);
    });
});

//每日绩效ajax数据
router.post('/report', function(req, res, next) {
    var baseRequest = remoteRequest(req , res);
    var info = req.body;
    console.log(info.dateTime);
    var url = '/report/getCommentReport';
    var data = {
         date:info.dateTime,
    };
    baseRequest.post(url , data , function(err , response , body){
        var jsonStr = JSON.parse(body);
        console.log('jsonStr',jsonStr);
        if('SUCCESS' == jsonStr.code || 'RESULT_EMPTY' == jsonStr.code){
             res.render('xhs/tongji/ajax_report_list' , jsonStr , function(err , html){
                console.log('html',html)
                res.send(html);
             });
        }else{
            // res.redirect('/login');
        }
    });
});


module.exports = router;
