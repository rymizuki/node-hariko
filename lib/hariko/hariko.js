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
    watch:    argv.watch,
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
  exec: function (cb) {
    logger.verbose('Starting hariko ...');
    this.resource = HarikoResource.create(this.files);
    this.server = HarikoServer.create({
      port:     this.options.port,
      host:     this.options.host,
      proxy:    this.options.proxy,
      verbose:  this.options.verbose
    });
    if (this.options.watch) {
      this.resource.watch(function () {
        this.server.reload(this.resource.toJSON());
      }.bind(this));
    }
    this.server.start(this.resource.toJSON(), cb);
  }
};

exports.Hariko = Hariko;
exports.create = function (argv) {
  return new Hariko(argv);
};

