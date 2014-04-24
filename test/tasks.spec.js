var should       = require('should');
var sinon        = require('sinon');
var fs           = require('fs');
var tasks        = require('../src/tasks');

describe('Tasks', function() {

  describe('Out of date', function() {

    var TASK = {
      src: '/input/file.txt',
      dest: '/output/file.bin'
    };

    var STAT_MODIFIED = function(mtime) {
      return {
        mtime: new Date(Date.parse(mtime))
      };
    };

    beforeEach(function() {
      sinon.stub(fs, 'statSync');
    });

    afterEach(function() {
      fs.statSync.restore();
    });

    it('rebuilds when dest does not exist', function() {
      fs.statSync.withArgs(TASK.src).returns(STAT_MODIFIED('2014-04-20'));
      fs.statSync.withArgs(TASK.dest).throws(new Error('File not found'));
      tasks.outOfDate(TASK).should.eql(true);
    });

    it('rebuilds when src is newer than dest', function() {
      fs.statSync.withArgs(TASK.src).returns(STAT_MODIFIED('2014-04-23'));
      fs.statSync.withArgs(TASK.dest).returns(STAT_MODIFIED('2014-04-20'));
      tasks.outOfDate(TASK).should.eql(true);
    });

    it('ignores when dest is newer than src', function() {
      fs.statSync.withArgs(TASK.src).returns(STAT_MODIFIED('2014-04-20'));
      fs.statSync.withArgs(TASK.dest).returns(STAT_MODIFIED('2014-04-23'));
      tasks.outOfDate(TASK).should.eql(false);
    });

    it('ignores when src does not exist (should not happen)', function() {
      fs.statSync.withArgs(TASK.src).throws(new Error('File not found'));
      fs.statSync.withArgs(TASK.dest).returns(STAT_MODIFIED('2014-04-20'));
      tasks.outOfDate(TASK).should.eql(false);
    });

  });

  describe('Destination folders', function() {

    it('lists all required folders for the given tasks', function() {
      var folders = tasks.destinationFolders([
        { src: '/some/file1', dest: '/bin/foo/file1.txt' },
        { src: '/some/file2', dest: '/bin/foo/file2.txt' },
        { src: '/some/file3', dest: '/bin/bar/output/file3.txt' },
        { src: '/my/archive', dest: '/pkg/archive.tar' }
      ]);
      folders.should.eql([
        '/bin/foo',
        '/bin/bar/output',
        '/pkg'
      ]);
    });

  });

});
