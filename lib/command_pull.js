'use strict';

var ArgUtil = require('flopmang');

module.exports = function (task, exec, done) {
    var argUtil = new ArgUtil(task, [
        {
            option: 'remote',
            defaultValue: 'origin',
            useAsFlag: false,
            useValue: true
        },
        {
            option: 'branch',
            defaultValue: null,
            useAsFlag: false,
            useValue: true
        }
    ]);


    var args = ['pull'].concat(argUtil.getArgFlags());

    // Add callback
    args.push(done);

    exec.apply(this, args);
};

module.exports.description = 'Pull a remote.';
