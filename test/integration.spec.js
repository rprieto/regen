var should       = require('should');
var sinon        = require('sinon');
var fs           = require('fs');
var path         = require('path');
var rimraf       = require('rimraf');
var regen        = require('../src/index');

describe('Integration', function() {

  before(cleanup);
  after(cleanup);

  it('builds all dest files from scratch', function(done) {
    regen({
      cwd: path.join(__dirname, 'data'),
      src: '**/*.txt',
      dest: '../tmp/$path/$name.rand',
      process: 'echo "initial" > $dest'
    }, done);
  });

  it('checks they have the correct content', function() {
    checkContents('./tmp/one.rand', 'initial');
    checkContents('./tmp/folder/two.rand', 'initial');
  });

  it('tries to rebuild them again', function(done) {
    regen({
      cwd: path.join(__dirname, 'data'),
      src: '**/*.txt',
      dest: '../tmp/$path/$name.rand',
      process: 'echo "rebuilt" > $dest'
    }, done);
  });

  it('checks it did nothing', function() {
    checkContents('./tmp/one.rand', 'initial');
    checkContents('./tmp/folder/two.rand', 'initial');
  });

});

function cleanup(done) {
  rimraf(path.join(__dirname, 'tmp'), done);
}

function checkContents(file, contents) {
  var read = fs.readFileSync(path.join(__dirname, file));
  read.toString().should.include(contents);
}
