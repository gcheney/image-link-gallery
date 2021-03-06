// initialize app
require('dotenv').load(); // load environment variables
var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var compress = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var uglifyJs = require('uglify-js');
var fs = require('fs');
var passport = require('passport');

// bring in db and passport config
require('./api/models/db');
require('./api/config/passport');

// view engine setup
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

//uglify js files
var clientFiles = [
    'client/app.js',
    'client/home/home.controller.js',
    'client/about/about.controller.js',
    'client/auth/register/register.controller.js',
    'client/auth/login/login.controller.js',
    'client/imageDetail/imageDetail.controller.js',
    'client/users/users.controller.js',
    'client/commentModal/commentModal.controller.js',
    'client/updateCommentModal/updateCommentModal.controller.js',
    'client/addImageModal/addImageModal.controller.js',
    'client/updateImageModal/updateImageModal.controller.js',
    'client/deleteImageModal/deleteImageModal.controller.js',
    'client/common/directives/navigation/navigation.controller.js',
    'client/common/services/imageGalleryData.service.js',
    'client/common/services/authentication.service.js',
    'client/common/directives/footerBasic/footerBasic.directive.js',
    'client/common/directives/imageHover/imageHover.directive.js',
    'client/common/directives/navigation/navigation.directive.js',
    'client/common/directives/pageHeader/pageHeader.directive.js',
    'client/common/filters/addHtmlLineBreaks.filter.js'
];

var uglifiedFiles = uglifyJs.minify(clientFiles, { compress: false });

// write minified file to system
fs.writeFile('public/angular/imageGalleryApp.min.js', uglifiedFiles.code, function(err){
    if (err) {
        console.log(err);
    } else {
        console.log('Client scripts successfully minified');
    }
});

// set app port
var PORT = process.env.PORT || 3000;

// use logging in development and compression in production
if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
} else if (process.env.NODE_ENV === 'production') {
    app.use(compress());
}

//app setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'client')));

app.use(passport.initialize());

// app api routes
var api = require('./api/routes/index');
app.use('/api', api);

// send angular app to client
app.use(function(req, res){
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});


// *********** ERROR HANDLERS ********************** //

// Catch unauthorised errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({
            "message" : err.name + ": " + err.message
        });
    }
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

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

// *********** LISTEN ********************** //

app.listen(PORT, function(req, res) {
    console.log('App server is listening on port ' + PORT); 
    if (app.get('env') === 'development') {
        console.log('http://127.0.0.1:3000');
    }
});

module.exports = app;
