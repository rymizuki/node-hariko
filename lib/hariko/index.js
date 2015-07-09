var Hariko = require('./hariko'),
    logger = require('../logger');

exports.start = function (argv) {
  if (argv.verbose) logger.level = 'verbose';
  if (argv.time)    logger.time  = true;
  Hariko.create(argv).exec();
}
