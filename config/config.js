'use strict';

/**
 * Dependencies
 */

var _ = require('lodash'),
    glob = require('glob');

/**
 * App configuration
 */
module.exports = _.extend(
    require('./env/all'),
    require('./env/' + process.env.NODE_ENV) || {}
);

/**
 * Get files by glob patterns
 */
module.exports.getGlobbedFiles = function(globPatterns, removeRoot) {
    // context switching, url path regex, output array
    var _this = this,
        urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i'),
        output = [];

    if (_.isArray(globPatterns)) {
        globPatterns.forEach(function(globPattern) {
            output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
        });
    } else if (_.isString(globPatterns)) {
        if (urlRegex.test(globPatterns)) {
            output.push(globPatterns);
        } else {
            glob(globPatterns, {
                sync: true
            }, function(err, files) {
                if (removeRoot) {
                    files = files.map(function(file) {
                        return file.replace(removeRoot, '');
                    });
                }
                output = _.union(output, files);
            });
        }
    }
    return output;
};

/**
 * Get modules Javascript files
 */
module.exports.getJavascriptAssets = function(includeTests) {
    var output = this.getGlobbedFiles(this.assets.lib.js.concat(this.assets.js), 'public/');

    if (includeTests) {
        output = _.union(output, this.getGlobbedFiles(this.assets.tests));
    }

    return output;
};

/**
 * Get modules CSS files
 */
module.exports.getCSSAssets = function() {
    var output = this.getGlobbedFiles(this.assets.css, 'public/');

    return output;
};
