/*
   文章管理
   by liangfeng
   */
var express = require('express');
var router = express.Router();
var remoteRequest = require('libs/remoteRequest');
var remote = require('libs/remote');
var moment = require('moment');

/* 进入自动发送评论界面 */

router.get('/', function(req, res, next) {

    var url = '/autoSend/getAutoSendList';
    var options = {
        'autoSend' : {
            'url':'/httpclient/autoSend/getAutoSendList',
            'data':{

            },
            'method':'POST'
        },
        'userInfo'	: {
			'url'	: '/httpclient/adminUser/getCurrentUser',
			'data'	: '',
			'method': 'POST'
		}, 
        'menu' : {
            'url':'/httpclient/getMenu',
            'data':{},
            'method':'POST'
        }
    }

    remote(req , res , options , function(data){
        console.log(data.autoSend);
        data['userInfo'] = data.menu.userInfo;
        res.render('xhs/auto/auto_send' , data);
    });
});



module.exports = router;
