const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const OpenApiValidator = require('express-openapi-validator');
const Honeybadger = require('@honeybadger-io/js');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

Honeybadger.configure({
    apiKey: process.env.HONEYBADGER_API_KEY || 'key'
});

// has to be the first middleware
app.use(Honeybadger.requestHandler);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// add after body parsers

const spec = path.join(__dirname, 'api.yaml');
app.use('/spec', express.static(spec));

app.use(
    OpenApiValidator.middleware({
        apiSpec: './api.yaml',
        validateRequests: true, // (default)
        validateResponses: true, // false by default
    }),
);

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

app.use(Honeybadger.errorHandler);

app.use((err, req, res, next) => {
    // 7. Customize errors
    console.error(err); // dump error to console for debug
    res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
    });
});

module.exports = app;
