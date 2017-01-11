var express         = require('express'),
    path            = require('path'),
    favicon         = require('serve-favicon'),
    cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'),
    log4js          = require('log4js'),
    compression     = require('compression');

//var checkLogin = require('libs/checkLogin');
var controllers = require('./router');


var app = express();

//gzip
app.use(compression());
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(express.static(path.join(__dirname, '/public') , { maxAge: '3600000'  }));

log4js.configure(__dirname + '/config/log4js.json');
app.use(log4js.connectLogger(log4js.getLogger('normal'), {level:'auto', format:':method :url'}));

app.use(require('express-promise')());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

//app.use(checkLogin);
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({ extended: false ,  limit:'50mb' }));
app.use(cookieParser());



controllers(app);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
