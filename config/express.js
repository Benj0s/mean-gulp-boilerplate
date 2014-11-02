'use strict';

/**
 * Module dependencies
 */
var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    compress = require('compression'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    helmet = require('helmet'),
    mongoStore = require('connect-mongo') ({
        session: session
    }),
    flash = require('connect-flash'),
    config = require('./config'),
    consolidate = require('consolidate'),
    path = require('path');

module.exports = function(db) {
    // Initialise express app
    var app = express();

    // Globbing model files
    config.getGlobbedFiles('./app/components/**/*.server.model.js').forEach(function(modelPath) {
        require(path.resolve(modelPath));
    });

    // Setting application local variables
    app.locals.title = config.app.title;
    app.locals.description = config.app.description;
    app.locals.keywords = config.app.keywords;
    app.locals.jsFiles = config.getJavascriptAssets();
    app.locals.cssFiles = config.getCSSAssets();

    app.use(compress({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    app.set('showStackError', true);

    app.engine('server.view.html', consolidate[config.templateEngine]);

    app.set('view engine', 'server.view.html');
    // set the default views location
    // todo: would like this to support multiple view locations so they can exist specific component folders
    app.set('views', './app/components/views');

    // Environment dependant middleware
    if (process.env.NODE_ENV === 'development') {
        // Enable logger
        app.use(morgan('dev'));
        // Disable views cache
        app.set('view cache', false);
    } else if (process.env.NODE_ENV === 'production') {
        app.locals.cache = 'memory';
    }

    // Request body parsing middleware
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    // Enable jsonp
    app.enable('jsonp callback');

    app.use(cookieParser());

    // Express MongoDB session storage
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret,
        store: new mongoStore({
            db: db.connection.db,
            collection: config.sessionCollection
        })
    }));

    // Connect flash for flash messages
    app.use(flash());

    // Use helmet to secure Express headers
    app.use(helmet.xframe());
    app.use(helmet.xssFilter());
    app.use(helmet.nosniff());
    app.use(helmet.ienoopen());
    app.disable('x-powered-by');

    // Set static folder
    app.use(express.static(path.resolve('./public')));

    // Globbing routing files
    config.getGlobbedFiles('./app/components/**/*.server.routes.js').forEach(function(routePath) {
        require(path.resolve(routePath))(app);
    });

    // Assume 'not found' in the error msgs is a 404
    app.use(function(err, req, res, next) {
        if (!err) {
            return next();
        }

        res.status(500).render('500', {
            error: err.stack
        });
    });

    // Assume 404 since no middleware responded
    app.use(function(req, res) {
        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Not found'
        });
    });

    return app;
};
