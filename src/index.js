var os       = require('os');
var path     = require('path');
var glob     = require('glob');
var async    = require('async');
var mkdirp   = require('mkdirp');
var patterns = require('./patterns');
var tasks    = require('./tasks');

module.exports = function(opts, callback) {

  function createTask(file) {
    return {
      src:  path.resolve(opts.cwd, file),
      dest: path.resolve(opts.cwd, opts.dest(file))
    };
  }

  if (typeof opts.dest === 'string') {
    opts.dest = patterns.dest(opts.dest);
  }

  if (typeof opts.process === 'string') {
    opts.process = patterns.process(opts.process);
  }

  if (typeof opts.parallel === 'cpu') {
    opts.parallel = os.cpus().length;
  }

  opts.parallel = opts.parallel || 0;

  var globOptions = {
    cwd: opts.cwd,
    nonull: false,
    nocase: true
  };

  glob(opts.src, globOptions, function (err, files) {

    if (err) return callback(err);

    // list of tasks that need rebuilding
    var all = files.map(createTask)
                   .filter(tasks.outOfDate);

    // create any required folders
    var folders = tasks.destinationFolders(all);
    folders.forEach(function(f) { mkdirp.sync(f, 0777); });

    // list of actual operations
    var fns = all.map(tasks.run(opts.process));

    // run them!
    if (opts.parallel > 0) {
      async.parallelLimit(fns, opts.parallel, callback);
    } else {
      async.series(fns, callback);
    }

  });

};
