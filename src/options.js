var os       = require('os');
var patterns = require('./patterns');


exports.parse = function(opts) {

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

  if (!opts.cwd)     throw new Error('Missing option: cwd');
  if (!opts.src)     throw new Error('Missing option: src');
  if (!opts.dest)    throw new Error('Missing option: dest');
  if (!opts.process) throw new Error('Missing option: process');

  return opts;

};
