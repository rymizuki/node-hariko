var fs            = require('fs'),
    _             = require('lodash'),
    gaze          = require('gaze'),
    pathToRegexp  = require('path-to-regexp');
var parser    = require('./resource/parser'),
    external  = require('./resource/external'),
    logger    = require('../logger');

var DEFAULT_OUTPUT_DESTINATION = '.hariko-cache';

function HarikoResource (files, options) {
  this.files    = files;
  this.options  = options || {};
  this._data    = {};
  this.warnings = [];
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
    this._data     = data.entries;
    this._warnings = data.warnings;
    if (this.options.output) external.save(this.options.output, this._data);
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
    var entry = this._getEntry(req);
    if (entry && this.options.output) {
      entry.response.data = external.read(this.options.output, entry);
      logger.debug('%j', entry.data);
      return entry;
    } else {
      return entry;
    }
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
      resources = _.chain(resources).sortBy(function (resource) {
        return resource.request.uri.queries.length;
      }).value();
    } else {
      logger.debug('request', req.path, req.query);
      logger.debug('entries', _.map(resources, function (entry) { return entry.request.uri.queries }));

      var perfectMatchResources = _.select(resources, function (resource) {
        var queries = resource.request.uri.queries;
        if ('object' !== typeof queries[0]) return false;
        for (var i = 0; i < queries.length; i++) {
          var query = queries[i];
          if (!req.query[query.name])                return false;
          if (req.query[query.name] != query.value)  return false;
        }
        return true;
      });

      if (perfectMatchResources.length > 0) {
        resources = perfectMatchResources;
      }
      resoruces = _.sortBy(resources, function (resource) {
        return _.chain(resource.request.uri.queries)
          .select(function (query) {
            return params.indexOf(query) > -1;
          })
          .size();
      });
    }
    return resources.shift();
  }
};

exports.HarikoResource = HarikoResource;
exports.create = function (files, options) {
  return new HarikoResource(files, options);
};

