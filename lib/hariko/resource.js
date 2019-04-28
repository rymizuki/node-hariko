var fs            = require('fs'),
    _             = require('lodash'),
    gaze          = require('gaze');
var parser    = require('../hariko-parser'),
    external  = require('./resource/external'),
    logger    = require('../logger');
var Entries   = require('./entries');

var DEFAULT_OUTPUT_DESTINATION = '.hariko-cache';

function HarikoResource (files, options) {
  this.files    = files;
  this.options  = options || {};
  this.warnings = [];
  this.entries  = new Entries();
  this.watcher  = null;
  if (this.options.output !== undefined && this.options.output !== null) {
    if (this.options.output.length === 0 || this.options.output === true) this.options.output = DEFAULT_OUTPUT_DESTINATION;
    logger.info('Run a resource in the output mode.');
    logger.info('  destination: ', this.options.output);
  }
  this.read();
}

HarikoResource.prototype = {
  read: function () {
    logger.verbose('Resource reading files...');
    var data = this._parse(this._loadFile());
    this.entries.ensure(data.entries);
    this._warnings = data.warnings;
    if (this.options.output) external.save(this.options.output, this.entries.raw());
  },
  watch: function (cb) {
    if (this.watcher) this.watcher.close();
    this.watcher = gaze(this.files);
    this.watcher.on('ready', function () {
      logger.info('Watching resource files...');
    });
    this.watcher.on('all', function () {
      this.read();
      if (cb) cb();
    }.bind(this));
  },
  _loadFile: function () {
    logger.verbose('Resource loading files...');
    return _.chain(this.files)
      .map(function (filepath) {
        return fs.readFileSync(filepath).toString();
      })
      .join('')
      .value();
  },
  _parse: function (rawdata) {
    logger.verbose('Resource parsing markdown...');
    return parser.parse(rawdata);
  },
  getEntry: function (req) {
    var entry = this.entries.get(req);
    if (entry && this.options.output) {
      entry.response.data = external.read(this.options.output, entry);
      logger.debug('%j', entry.data);
      return entry;
    } else {
      return entry;
    }
  },
};

exports.HarikoResource = HarikoResource;
exports.create = function (files, options) {
  return new HarikoResource(files, options);
};
