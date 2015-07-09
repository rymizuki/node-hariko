var pathToRegexp  = require('path-to-regexp'),
    logger        = require('../../logger');

module.exports = function (entries) {
  function getResources (method, pathname) {
    var resources = [];
    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      var regex = pathToRegexp(entry.request.uri.path);
      if (method === entry.request.method && regex.exec(pathname))
        resources.push(entry);
    }
    return resources;
  }

  function getResource (req, resources) {
    if (!resources || resources.length <= 0) return;
    var params = Object.keys(req.query);
    if (params.length === 0) {
      resources.sort(function (a, b) {
        return (a.request.uri.queries.length - b.request.queries.length);
      });
    } else {
      resources.forEach(function (resource) {
        resource.request.query_params = {
          matching:     0,
          non_matching: 0
        };
        resource.request.uri.queries.forEach(function (query) {
          if (params.indexOf(query) > -1) {
            resource.request.query_params.matching     += 1;
          } else {
            resource.request.query_params.non_matching += 1;
          }
        });
      });
      resources.sort(function (a, b) {
        if (b.request.query_params.matching === a.request.query_params.matching) {
          return (a.request.query_params.non_matching - b.request.query_params.non_matching);
        } else {
          return (b.request.query_params.matching - a.request.query_params.matching);
        }
      });
    }
    return resources.shift();
  }

  return function (req, res, next) {
    var resource = getResource(req, getResources(req.method, req.path));
    if (resource) {
      res.status(+resource.response.statusCode);
      resource.response.headers.forEach(function (header) {
        res.set(header.name, header.value);
      });
      var body = resource.response.data ? JSON.stringify(resource.response.data) : resource.response.body;
      res.send(new Buffer(body));
      logger.verbose('Response:');
      logger.verbose('  STATUS:  %s', resource.response.statusCode);
      logger.verbose('  HEADERS: %j', resource.response.headers);
      logger.verbose('  BODY:    %s', body);
    } else {
      logger.verbose('Response:');
      logger.verbose('  Not found route in API-Blueprint resources.');
      logger.verbose('  Sended proxy request when you enabled proxy option.');
      next();
    }
  }
}
