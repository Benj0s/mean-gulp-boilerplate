'use strict';

/**
 * Module depandancies
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors/errors.server.controller'),
    Example = mongoose.model('Example');

/**
 * List examples
 */
exports.list = function(req, res) {
    Example.find().sort('-created').exec(function(err, examples) {
        if(err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(examples);
        }
    });
};
