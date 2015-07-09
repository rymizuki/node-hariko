var glob = require('glob');
var HarikoResource  = require('./resource'),
    HarikoServer    = require('./server'),
    logger          = require('../logger');

function Hariko (argv) {
  logger.verbose('Setup `hariko` ...');
  this.resource = null;
  this.options = {
    exclude:  argv.exclude,
    port:     argv.port,
    host:     argv.host,
    proxy:    argv.proxy,
    verbose:  argv.verbose
  };
  this.files   = this._parseGlob(argv.file);
  logger.verbose('  options:', this.options);
  logger.verbose('  files:', this.files);
}

Hariko.prototype = {
  _parseGlob: function (includes) {
    return glob.sync(includes, {ignore: this.options.exclude});
  },
  exec: function () {
    logger.verbose('Starting hariko ...');
    this.resource = HarikoResource.create(this.files);
    var entries = this.resource.toJSON();
    HarikoServer.create(entries, {
      port:     this.options.port,
      host:     this.options.host,
      proxy:    this.options.proxy,
      verbose:  this.options.verbose
    }).start();
  }
};

exports.Hariko = Hariko;
exports.create = function (argv) {
  return new Hariko(argv);
};

