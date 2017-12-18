var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var fblogin = require('./routes/fblogin');
var groups = require('./routes/groups');
var pinpoint = require('./routes/pinpoint');
var drawing = require('./routes/drawing');
var tracking = require('./routes/tracking')

var app = express();


//app.set('views', path.join(__dirname, 'views'));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use( function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials, Origin');
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use('/', index);
app.use('/users', users);
app.use('/fblogin', fblogin);
app.use('/groups', groups);
app.use('/pinpoint', pinpoint);
app.use('/drawing', drawing);
app.use('/tracking', tracking);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error' + err);
});

var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3002);

io.on('connection', function (socket) {

    //send to BD
    console.log('Un client est connected!');
    console.log('Le id du client est ' + socket.id);
    socket.emit('Notification', 'ASTONISHING');
    //socket.on('my other event', function (data) {
    //   console.log(data);
    //});
});

module.exports = app;
