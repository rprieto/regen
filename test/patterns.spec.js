var _            = require('lodash');
var should       = require('should');
var sinon        = require('sinon');
var async        = require('async');
var childProcess = require('child_process');
var patterns     = require('../src/patterns');

describe('Patterns', function() {

  describe('dest', function() {

    describe('tokens', function() {

      it('replaces $path with the base path to the source', function() {
        var fn = patterns.dest('custom/$path/output.bin');
        fn('the/source/file.txt').should.eql('custom/the/source/output.bin');
      });

      it('replaces $name with the source filename (no extension)', function() {
        var fn = patterns.dest('custom/$name.bin');
        fn('just/a/file.txt').should.eql('custom/file.bin');
      });

      it('replaces $ext with the source file extension', function() {
        var fn = patterns.dest('custom/output.$ext');
        fn('just/a/file.txt').should.eql('custom/output.txt');
      });

    });

    describe('path types', function() {

      it('works with absolute destination paths', function() {
        var fn = patterns.dest('/root/$path/$name.bin');
        fn('the/source/file.txt').should.eql('/root/the/source/file.bin');
      });

      it('works with relative destination paths', function() {
        var fn = patterns.dest('relative/$path/$name.bin');
        fn('the/source/file.txt').should.eql('relative/the/source/file.bin');
      });

      it('works with relative parent destination paths', function() {
        var fn = patterns.dest('../relative/$path/$name.bin');
        fn('the/source/file.txt').should.eql('../relative/the/source/file.bin');
      });

    });

  });

  describe('process', function() {

    before(function() {
      sinon.stub(childProcess, 'exec').yields(null);
    });

    after(function() {
      childProcess.exec.restore();
    });

    it('executes the given command with the src and dest paths', function() {
      var fn = patterns.process('command --in $src --out $dest');
      fn('/source/file.txt', '/dest/output.bin', function() {
        var expected = 'command --in "/source/file.txt" --out "/dest/output.bin"';
        sinon.assert.calledWith(childProcess.exec, expected);
      });
    });

  });

  describe('report', function() {

    this.slow(1000);
    this.timeout(1000);

    it('prints a progress bar to the console', function(done) {
      var fn = patterns.report('Processing $progress');
      var steps = slowOperations(fn, 5, 50);
      async.series(steps, done);
    });

    it('does not print anything if there is nothing to process', function(done) {
      var fn = patterns.report('Processing $progress');
      fn({totalFiles: 10, outdated: 0, processed: 0});
      done();
    });

  });

});

function slowOperations(reporter, count, wait) {
  reporter({totalFiles: count, outdated: count, processed: 0});
  return _.times(count, function(i) {
    return function(next) {
      reporter({totalFiles: count, outdated: count, processed: i + 1})
      setTimeout(next, wait);
    };
  })
}
