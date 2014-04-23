var _       = require('lodash');
var fs      = require('fs');
var os      = require('os');
var path    = require('path');
var glob    = require('glob');
var async   = require('async');
var mkdirp  = require('mkdirp');
var exec    = require('child_process').exec;

module.exports = function(opts, callback) {

  if (typeof opts.dest === 'string') {
    opts.dest = patternDest(opts.dest);
  }

  if (typeof opts.process === 'string') {
    opts.process = patternProcess(opts.process);
  }

  var globOptions = {
    cwd: opts.cwd,
    nonull: false,
    nocase: true
  };

  glob(opts.src, globOptions, function (err, files) {

    if (err) return callback(err);

    // create list of src/dest pairs
    var tasks = files.map(function(file) {
      return {
        src:  path.resolve(opts.cwd, file),
        dest: path.resolve(opts.cwd, opts.dest(file))
      };
    });

    // create all required folders
    var folders = _(tasks).pluck('dest').map(path.dirname).uniq().value();
    folders.forEach(function(f) { mkdirp.sync(f, 0777); });

    // run them in parallel
    var fns = tasks.filter(newer).map(function(task) {
      return opts.process.bind(this, task.src, task.dest);
    });
    async.parallelLimit(fns, os.cpus().length, callback);

  });

};

function patternDest(pattern) {
  var parts = pattern.split('/');
  var full = path.join.apply(this, parts);
  return function(file) {
    return full.replace('$path', path.dirname(file))
               .replace('$name', path.basename(file, path.extname(file)))
               .replace('$ext',  path.extname(file).substr(1));
  };
}

function patternProcess(pattern) {
  return function(src, dest, callback) {
    var command = pattern.replace('$src', '"' + src + '"')
                         .replace('$dest', '"' + dest + '"');
    exec(command, callback);
  };
}

function newer(task) {
  var srcTime = 0;
  try {
    var srcTime  = fs.statSync(task.src).ctime.getTime();
  } catch (ex) {
    return false;
  }
  try {
    var destTime = fs.statSync(task.dest).ctime.getTime();
    return srcTime > destTime;
  } catch (ex) {
    return true;
  }
};

