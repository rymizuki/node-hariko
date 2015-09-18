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
    output:   argv.output,
    proxy:    argv.proxy,
    cors:     argv.cors,
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
    this.resource = HarikoResource.create(this.files, {
      output: this.options.output
    });
    this.server = HarikoServer.create(this.resource, {
      port:     this.options.port,
      host:     this.options.host,
      proxy:    this.options.proxy,
      cors:     this.options.cors,
      verbose:  this.options.verbose
    });
    if (this.options.watch) {
      this.resource.watch(function () {
        this.server.reload();
      }.bind(this));
    }
    this.server.start(cb);
  }
};

exports.Hariko = Hariko;
exports.create = function (argv) {
  return new Hariko(argv);
};

