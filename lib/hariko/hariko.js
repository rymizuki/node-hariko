var glob = require('glob');
var HarikoResource = require('./resource'),
    HarikoServer   = require('./server');

function Hariko (argv) {
  this.resource = null;
  this.options = {
    exclude:  argv.exclude,
    port:     argv.port,
    host:     argv.host
  };
  this.files   = this._parseGlob(argv.file);
}

Hariko.prototype = {
  _parseGlob: function (includes) {
    return glob.sync(includes, {ignore: this.options.exclude});
  },
  exec: function () {
    this.resource = HarikoResource.create(this.files);
    var entries = this.resource.toJSON();
    HarikoServer.create(entries, {
      port: this.options.port,
      host: this.options.host
    }).start();
  }
};

exports.Hariko = Hariko;
exports.create = function (argv) {
  return new Hariko(argv);
};

