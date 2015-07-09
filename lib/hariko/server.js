var _             = require('lodash'),
    express       = require('express'),
    bodyParser    = require('body-parser'),
    proxy         = require('express-http-proxy'),
    colors        = require('colors');
var selfAssertive = require('./server-middleware/self-assertive'),
    cors          = require('./server-middleware/cors'),
    logging       = require('./server-middleware/logging'),
    routing       = require('./server-middleware/routing');
var logger = require('../logger');

function HarikoServer (entries, options) {
  this.entries = entries;
  this.options  = _.defaults(options, {
    port:     3000,
    host:     'localhost',
    proxy:    false,
    verbose:  false
  });
  this.setup();
}

HarikoServer.prototype = {
  setup: function () {
    this.app = express();
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(selfAssertive());
    if (this.options.verbose) {
      this.app.all('*', logging());
    }
    if (this.options.cors) {
      var cors = typeof this.options.cors === 'object' ? this.options.cors : {};
      this.app.use(cors(cors));
    }
    this.app.use(routing(this.entries));
    if (this.options.proxy) {
      this.app.all('*', proxy(this.options.proxy));
    }
  },
  start: function () {
    logger.verbose('Starting server ...');
    logger.verbose('  options:', this.options);
    var server = this;
    this.app.listen(this.options.port, this.options.host || 'localhost', function () {
      var url = 'http://'+server.options.host + ':' + server.options.port;
      logger.info('Running Hariko Server ... ' + url.cyan);
    });
    return this.app;
  }
};

exports.HarikoServer = HarikoServer;
exports.create = function (entries, options) {
  return new HarikoServer(entries, options);
}
