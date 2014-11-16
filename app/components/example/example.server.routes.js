'use strict';

/**
 * Module Dependencies
 */
var example = require('./example.server.controller');

module.exports = function(app) {
    app.route('/example')
        .get(example.list);
};
