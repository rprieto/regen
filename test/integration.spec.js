var should       = require('should');
var sinon        = require('sinon');
var fs           = require('fs');
var path         = require('path');
var rimraf       = require('rimraf');
var touch        = require('touch');
var regen        = require('../src/index');

describe('Integration', function() {

  before(cleanup);
  after(cleanup);

  it('builds all destination files from scratch', function(done) {
    rebuild('initial', function() {
      checkContents('./tmp/one.rand', 'initial');
      checkContents('./tmp/folder/two.rand', 'initial');
      done();
    });
  });

  it('does nothing if rebuilding straight away', function(done) {
    rebuild('round two', function() {
      checkContents('./tmp/one.rand', 'initial');
      checkContents('./tmp/folder/two.rand', 'initial');
      done();
    });
  });

  it('rebuilds files if the source file has changed', function(done) {
    var futureDate = new Date().getTime() + 1000;
    touch.sync(path.join(__dirname, './data/one.txt'), {time: futureDate});
    rebuild('round three', function() {
      checkContents('./tmp/one.rand', 'round three');
      checkContents('./tmp/folder/two.rand', 'initial');
      done();
    });
  });

});

function cleanup(done) {
  rimraf(path.join(__dirname, 'tmp'), done);
}

function rebuild(contents, done) {
  regen({
    cwd: path.join(__dirname, 'data'),
    src: '**/*.txt',
    dest: '../tmp/$path/$name.rand',
    process: 'echo "' + contents +'" > $dest'
  }, done);
}

function checkContents(file, contents) {
  var read = fs.readFileSync(path.join(__dirname, file));
  read.toString().should.include(contents);
}
