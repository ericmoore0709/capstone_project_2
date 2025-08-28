const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
const initializePassport = require('./auth');
const { authenticateJWT } = require('./src/middleware/auth')

const indexRouter = require('./src/routes/index');
const authRouter = require('./src/routes/auth');
const recipesRouter = require('./src/routes/recipes');
const shelvesRouter = require('./src/routes/shelves');
const profilesRouter = require('./src/routes/profiles');
const communitiesRouter = require('./src/routes/communities');

const app = express();

// allow localhost frontend to communicate with localhost backend
app.use(cors({
  origin: `${process.env.CLIENT_BASE_URL}`,
  credentials: true,
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use(authenticateJWT);

// Initialize Passport and session handling
app.use(passport.initialize());
app.use(passport.session());

// Initialize Passport configuration (loads Google Strategy)
initializePassport();

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/recipes', recipesRouter);
app.use('/shelves', shelvesRouter);
app.use('/profiles', profilesRouter);
app.use('/communities', communitiesRouter);

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
  if (process.env.NODE_ENV !== "test")
    console.log(err.stack);
  res.status(err.status || 500);
  res.json({ 'error': err.message });
});

module.exports = app;
