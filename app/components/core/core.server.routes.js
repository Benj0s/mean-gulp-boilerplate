'use strict';

/**
 * Core routing
 */
module.exports = function(app) {
    // set rooting for the root
    var core = require('./core');
    app.route('/').get(core.index);
};

// tasdasdasdasdaasdassd
