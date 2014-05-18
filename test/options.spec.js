var _            = require('lodash');
var should       = require('should');
var sinon        = require('sinon');
var os           = require('os');
var options      = require('../src/options');
var patterns     = require('../src/patterns');

describe('Options', function() {

  describe('validation', function() {

    var valid = {
      cwd: '/my/files',
      src: '**/*.txt',
      dest: '$path/$name.md5',
      process: 'cat $src | md5 > $dest'
    };

    var mandatory = ['cwd', 'src', 'dest', 'process'];

    it('errors on missing mandatory fields', function() {
      mandatory.forEach(function(field) {
        var opts = _.omit(valid, field);
        (function() {
          options.parse(opts);
        }).should.throw(/Missing/);
      });
    });

  });

  describe('patterns', function() {

  });

  describe('parallel', function() {

  });

});
