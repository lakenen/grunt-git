'use strict';

var assert = require('assert');
var grunt = require('grunt');
var _ = require('lodash');

var Task = (function () {
    function Task(test) {
        this.test = test;
    }

    Task.prototype.options = function (defaults) {
        return _.defaults(this.test.options, defaults);
    };

    Object.defineProperty(Task.prototype, 'files', {
        get: function () {
            return [
                {
                    src: this.test.files
                }
            ];
        }
    });

    return Task;
})();

var Test = (function () {
    function Test(command, options, files) {
        this.command = command;
        this.options = options;
        this.files = files || [];

        this.expectations = [];
    }

    Test.prototype.expect = function (args, result) {
        if (!result) {
            result = [ null, '', 0 ];
        }
        this.expectations.push({ args: args, result: result });
        return this;
    };

    Test.prototype.run = function (cb) {
        var task = new Task(this);

        var self = this;
        var exec = function () {
            var args = Array.prototype.slice.call(arguments);
            assert(self.expectations.length > 0, 'No more commands expected!');

            var expectation = self.expectations.shift();
            assert(args.length > 0, 'Cannot have an empty expectation');

            var callback = args.pop();
            assert(_.isFunction(callback), 'Last argument to exec should be a callback');

            assert.deepEqual(args, expectation.args);
            callback.apply(null, expectation.result);
        };

        var done = function (err) {
            assert.equal(err, null);
            assert.equal(self.expectations.length, 0, 'Did not match all expectations');
            cb();
        };

        this.command(task, exec, done, grunt);
    };

    return Test;
})();

module.exports = Test;
