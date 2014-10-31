'use strict';

/**
 * Module dependancies
 */
var init = require('./config/init')(),
    config = require('./config/config'),
    mongoose = require('mongoose');

/**
 * Main application entry file
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
    if (err) {
        console.error('\x1b[31m', 'Could not connect to MongoDB!');
		console.log(err);
    }
});

var app = require('./config/express')(db);

// Start app by listening on port
app.listen(config.port);

// Expose app
exports = module.exports = app;

console.log('Mean-Gulp application started on port ' + config.port);
