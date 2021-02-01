const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const hbs = require("hbs");

const authention=require("./middlewares/authention");
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
// var Login=require("./contronllers/LoginController");
// var login= new Login();


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper("inc",(value,options)=> {return (+value)+1});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: "congdat",
  resave: true,
  saveUninitialized: true,
  cookie:{ maxAge: 30*60*1000 }
}))
// app.get("/login",login.getLogin);
// app.post("/login",login.postLogin);
// app.get("/register",login.getRegister);
// app.post("/register",login.postRegister);
app.use('/', authention.authention,indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
