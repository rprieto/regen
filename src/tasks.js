var _     = require('lodash');
var fs    = require('fs');
var path  = require('path');

exports.outOfDate = function(task) {
  var srcTime = 0;
  try {
    var srcTime  = fs.statSync(task.src).mtime.getTime();
  } catch (ex) {
    return false;
  }
  try {
    var destTime = fs.statSync(task.dest).mtime.getTime();
    return srcTime > destTime;
  } catch (ex) {
    return true;
  }
};

exports.destinationFolders = function(tasks) {
  return _(tasks).pluck('dest').map(path.dirname).uniq().value();
};

exports.run = function(process) {
  return function(task) {
    return process.bind(this, task.src, task.dest);
  };
};
