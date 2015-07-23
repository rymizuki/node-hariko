var proxy  = require('http-proxy').createProxyServer();
var logger = require('../../logger');

module.exports = function (target, resource) {
  return function (req, res, next) {
    var entry = resource.getEntry(req);
    if (entry) {
      next();
    } else {
      logger.verbose('Proxy Request');
      logger.verbose('  TARGET: %s', target);
      proxy.web(req, res, {target: target});
    }
  };
};
