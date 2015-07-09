var logger = require('../../logger');

module.exports = function (options) {
  return function (req, res, next) {
    logger.verbose('Request:');
    logger.verbose('  URL:     %s',  req.url);
    logger.verbose('  METHOD:  %s',  req.method);
    logger.verbose('  HEADERS: %j',  req.headers);
    logger.verbose('  QUERY:   %j',  req.query);
    logger.verbose('  BODY:    %j',  req.body);
    next();
  }
};
