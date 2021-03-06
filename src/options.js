var os        = require('os');
var patterns  = require('./patterns');

exports.parse = function(opts) {

  if (typeof opts.dest === 'string') {
    opts.dest = patterns.dest(opts.dest);
  }

  if (typeof opts.process === 'string') {
    opts.process = patterns.process(opts.process);
  }

  if (typeof opts.report === 'string') {
    opts.report = patterns.report(opts.report);
  }

  if (typeof opts.parallel === 'cpu') {
    opts.parallel = os.cpus().length;
  }

  // Mandatory values
  if (!opts.cwd)     throw new Error('Missing option: cwd');
  if (!opts.src)     throw new Error('Missing option: src');
  if (!opts.dest)    throw new Error('Missing option: dest');
  if (!opts.process) throw new Error('Missing option: process');

  // Optional values
  opts.parallel = opts.parallel || 0;
  opts.report   = opts.report   || function() {};

  return opts;

};
