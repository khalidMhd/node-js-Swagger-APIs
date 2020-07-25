var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/Sabzi-Ghar', {useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true});
mongoose.connect('mongodb://SabziGhar:sabzighar1234@sabzighar-shard-00-00.wi4qk.mongodb.net:27017,sabzighar-shard-00-01.wi4qk.mongodb.net:27017,sabzighar-shard-00-02.wi4qk.mongodb.net:27017/SabziGhar?ssl=true&replicaSet=atlas-97ysqq-shard-0&authSource=admin&retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true});


var conn =mongoose.Collection;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.status(404).json({
    error:"Page Not Found"
  })
  res.status(500).json({
    error:"Internal Server Error"
  })
});

module.exports = app;
