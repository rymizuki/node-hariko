var _             = require('lodash'),
    express       = require('express'),
    bodyParser    = require('body-parser'),
    pathToRegexp  = require('path-to-regexp');

var ASSERTIVE_NAME = 'Hariko API Server'

function selfAssertiveMiddleware () {
  return function (req, res, next) {
    res.set('X-Powered-By', ASSERTIVE_NAME);
    next();
  }
}

function corsMiddleware (options) {
  return function (req, res, next) {
    res.set('Access-Control-Allow-Origin',
        options.cors['Access-Control-Allow-Origin'] || req.headers.origin);
    res.set('Access-Control-Allow-Methods',
        options.cors['Access-Control-Allow-Methods'] || req.headers['access-control-request-method']);
    res.set('Access-Control-Allow-Headers',
        options.cors['Access-Control-Allow-Headers'] || req.headers['access-control-request-headers']);
    next();
  }
}

function bakerRouteMiddleware (entries) {
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
    console.log(req.path);
    var resource = getResource(req, getResources(req.method, req.path));
    if (resource) {
      res.status(+resource.response.statusCode);
      resource.response.headers.forEach(function (header) {
        res.set(header.name, header.value);
      });
      var body = resource.response.data ? JSON.stringify(resource.response.data) : resource.response.body;
      res.send(new Buffer(body));
    } else {
      next();
    }
  }
}

function HarikoServer (entries, options) {
  this.entries = entries;
  this.options  = _.defaults(options, {
    port: 3000,
    host: 'localhost'
  });
  this.setup();
}

HarikoServer.prototype = {
  setup: function () {
    this.app = express();
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(selfAssertiveMiddleware());
    if (this.options.cors) {
      var cors = typeof this.options.cors === 'object' ? this.options.cors : {};
      this.app.use(corsMiddleware(cors));
    }
    this.app.use(bakerRouteMiddleware(this.entries));
  },
  start: function () {
    var server = this;
    this.app.listen(this.options.port, this.options.host || 'localhost', function () {
      console.log('runnning ... http://%s:%s', server.options.host, server.options.port);
    });
    return this.app;
  }
};

exports.HarikoServer = HarikoServer;
exports.create = function (entries, options) {
  return new HarikoServer(entries, options);
}
