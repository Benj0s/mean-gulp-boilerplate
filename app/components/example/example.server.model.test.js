'use strict';

/**
 * Module dependencies
 */

var should = require('should'),
    mongoose = require('mongoose'),
    Example = mongoose.model('Example');

/**
 * Globals
 */
var example;

/**
 * Test examples model
 */
describe('Example Model Unit Test:', function() {
    beforeEach(function(done) {
        example = new Example({
            title: 'Test Example',
            content: 'Content for the test Example'
        });
        done();
    });

    describe('Method Save', function() {
        it('should be able to save example', function(done) {
            return example.save(function(err) {
                should.not.exist(err);
                done();
            });
        });
    });

    afterEach(function(done) {
        Example.remove().exec();
        done();
    });
});
