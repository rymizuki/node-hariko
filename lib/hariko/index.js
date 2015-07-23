var Hariko = require('./hariko'),
    logger = require('../logger');

exports.start = function (argv, cb) {
  if (argv.verbose)   logger.level = 'verbose';
  if (argv.logLevel)  logger.level = argv.logLevel;
  if (argv.time)      logger.time  = true;
  Hariko.create(argv).exec(cb);
};
