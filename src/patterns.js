var path = require('path');
var childProcess = require('child_process');

exports.dest = function(pattern) {
  var absolutePrefix = (pattern[0] === '/') ? '/' : '';
  var parts = pattern.split('/');
  var full = path.join.apply(this, parts);
  return function(file) {
    return absolutePrefix +
           full.replace('$path', path.dirname(file))
               .replace('$name', path.basename(file, path.extname(file)))
               .replace('$ext',  path.extname(file).substr(1));
  };
};

exports.process = function(pattern) {
  return function(src, dest, callback) {
    var command = pattern.replace('$src', '"' + src + '"')
                         .replace('$dest', '"' + dest + '"');
    childProcess.exec(command, callback);
  };
};
