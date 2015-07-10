var fs            = require('fs'),
    _             = require('lodash'),
    protagonist   = require('protagonist'),
    gaze          = require('gaze'),
    pathToRegexp  = require('path-to-regexp');
var parser    = require('./resource/parser'),
    logger    = require('../logger');

var DEFAULT_OUTPUT_DESTINATION = '.hariko-cache';

function HarikoResource (files, options) {
  this.files    = files;
  this.options  = options || {};
  this._data    = {};
  this.warnings = [];
  this.watcher  = null;
  this.read();
}

HarikoResource.prototype = {
  read: function () {
    logger.verbose('Resource reading files...');
    this._data = this._parse(this._loadFile());
  },
  watch: function (cb) {
    if (this.watcher) this.watcher.close();
    this.watcher = gaze(this.files);
    this.watcher.on('ready', function () {
      logger.info('Watching resource files...');
    });
    this.watcher.on('all', function () {
      this.read();
      cb();
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
    var data = protagonist.parseSync(rawdata);
    var apiResource = [];
    if (data.warnings)
      this.warnings = data.warnings;
    return parser.parse(data);
  },
  entries: function () {
    return this._data;
  },
  getEntry: function (req) {
    var entry = this._getEntry(req);
    return entry;
  },
  _getEntry: function (req) {
    var resources = [];
    for (var i = 0; i < this._data.length; i++) {
      var entry = this._data[i];
      var regex = pathToRegexp(entry.request.uri.path);
      if (req.method === entry.request.method && regex.exec(req.path))
        resources.push(entry);
    }
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
};

exports.HarikoResource = HarikoResource;
exports.create = function (files, options) {
  return new HarikoResource(files, options);
};

