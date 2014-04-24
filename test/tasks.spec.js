var should       = require('should');
var sinon        = require('sinon');
var tasks        = require('../src/tasks');

describe('Tasks', function() {

  describe('Out of date', function() {

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
