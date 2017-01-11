var index = require('./controllers/xhs/index');
var user = require('./controllers/xhs/user');
var comment = require('./controllers/xhs/comment');
var common_comment = require('./controllers/xhs/common_comment');
var article = require('./controllers/xhs/article');
var tongji = require('./controllers/xhs/tongji');
var auto_send = require('./controllers/xhs/auto_send');



module.exports = function(app){
	app.use('/', index);
	app.use('/user', user);
	app.use('/comment', comment);
	app.use('/common_comment', common_comment);
	app.use('/article' , article);
	app.use('/tongji' , tongji);
	app.use('/auto_send', auto_send);
}
