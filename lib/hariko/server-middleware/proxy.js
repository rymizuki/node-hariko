var proxy         = require('http-proxy').createProxyServer(),
    pathToRegexp  = require('path-to-regexp');
var logger        = require('../../logger');

module.exports = function (target, entries) {
  function getResources (method, pathname) { // copy from ./routing.js
    var resources = [];
    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      var regex = pathToRegexp(entry.request.uri.path);
      if (method === entry.request.method && regex.exec(pathname))
        resources.push(entry);
    }
    return resources;
  }
  return function (req, res, next) {
    var resources = getResources(req.method, req.path);
    if (resources.length > 0) {
      next();
    } else {
      logger.verbose('Proxy Request');
      logger.verbose('  TARGET: %s', target);
      proxy.web(req, res, {target: target});
    }
  }
}
