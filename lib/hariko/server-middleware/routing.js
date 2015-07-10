var logger = require('../../logger');

module.exports = function (resource) {
  return function (req, res, next) {
    var entry = resource.getEntry(req);
    if (entry) {
      res.status(+entry.response.statusCode);
      entry.response.headers.forEach(function (header) {
        res.set(header.name, header.value);
      });
      var body = entry.response.data ? JSON.stringify(entry.response.data) : entry.response.body;
      res.send(new Buffer(body));
      logger.verbose('Response:');
      logger.verbose('  STATUS:  %s', entry.response.statusCode);
      logger.verbose('  HEADERS: %j', entry.response.headers);
      logger.verbose('  BODY:    %s', body);
    } else {
      logger.verbose('Response:');
      logger.verbose('  Not found route in API-Blueprint resources.');
      logger.verbose('  Sended proxy request when you enabled proxy option.');
      next();
    }
  }
}
