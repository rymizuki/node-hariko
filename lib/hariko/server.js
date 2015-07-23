var _             = require('lodash'),
    express       = require('express'),
    http          = require('http'),
    bodyParser    = require('body-parser'),
    colors        = require('colors');
var selfAssertive = require('./server-middleware/self-assertive'),
    cors          = require('./server-middleware/cors'),
    logging       = require('./server-middleware/logging'),
    routing       = require('./server-middleware/routing'),
    proxy         = require('./server-middleware/proxy');
var logger = require('../logger');

function HarikoServer (resource, options) {
  if (!resource) throw new Error('Undefined resources. Server cannot run.');
  this.resource = resource;
  this.options  = _.defaults(options, {
    port:     3000,
    host:     'localhost',
    cors:     false,
    proxy:    false,
    verbose:  false
  });
  this.app = express();
}

HarikoServer.prototype = {
  setup: function () {
    if (this.options.verbose) {
      this.app.all('*', logging());
    }
    if (this.options.cors) {
      var corsOpts = typeof this.options.cors === 'object' ? this.options.cors : {};
      this.app.use(cors(corsOpts));
    }
    if (this.options.proxy) {
      this.app.all('*', proxy(this.options.proxy, this.resource));
    }
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(selfAssertive());
    this.app.use(routing(this.resource));
  },
  start: function (cb) {
    logger.verbose('Starting server ...');
    logger.verbose('  options:', this.options);
    this.setup();
    this._server = http.createServer(this.app);
    this._server.on('listening', function () {
      var url = 'http://' + this.options.host + ':' + this.options.port;
      logger.info('Running Hariko Server ... ' + url.cyan);
    }.bind(this));
    this._server.on('close', function () {
      logger.info('Stoping Hariko Server');
    }.bind(this));
    this._server.listen(this.options.port, this.options.host || 'localhost', function () { if (cb) cb(); });
  },
  stop: function () {
    this._server.close();
    this._server = null;
  },
  reload: function (entries) {
    this.stop();
    this.start(entries);
  }
};

exports.HarikoServer = HarikoServer;
exports.create = function (entries, options) {
  return new HarikoServer(entries, options);
};
