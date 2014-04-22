var _       = require('lodash');
var fs      = require('fs');
var os      = require('os');
var path    = require('path');
var glob    = require('glob');
var async   = require('async');
var mkdirp  = require('mkdirp');

module.exports = function(opts, callback) {

  if (typeof opts.dest === 'string') {
    opts.dest = rename(opts.dest);
  }

  var globOptions = {
    cwd: opts.source,
    nonull: false,
    nocase: true
  };

  glob(opts.filter, globOptions, function (err, files) {

    if (err) return callback(err);

    // create list of src/dest pairs
    var tasks = files.map(function(file) {
      return {
        src:  path.resolve(path.join(opts.source, file)),
        dest: path.resolve(opts.dest(file))
      };
    });

    // create all required folders
    var folders = _(tasks).pluck('dest').map(path.dirname).uniq().value();
    folders.forEach(function(f) { mkdirp.sync(f, 0777); });

    // run them in parallel
    var fns = tasks.filter(function(task) {
      return newer(task.src, task.dest);
    }).map(function(task) {
      return opts.process.bind(this, task.src, task.dest);
    });
    async.parallelLimit(fns, os.cpus().length, callback);

  });

};

function rename(pattern) {
  var parts = pattern.split('/');
  var full = path.join.apply(this, parts);
  return function(file) {
    return full.replace('$path', path.dirname(file))
               .replace('$name', path.basename(file, path.extname(file)))
               .replace('$ext',  path.extname(file).substr(1));
  }
}

function newer(src, dest) {
  var srcTime = 0;
  try {
    var srcTime  = fs.statSync(src).ctime.getTime();
  } catch (ex) {
    return false;
  }
  try {
    var destTime = fs.statSync(dest).ctime.getTime();
    return srcTime > destTime;
  } catch (ex) {
    return true;
  }
};

