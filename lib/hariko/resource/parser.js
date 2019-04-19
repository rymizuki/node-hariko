var protagonist = require('protagonist'),
    _           = require('lodash');
var external  = require('./external');

var EntryEntity = (function () {
  var JSON = require('json5');
  var URL = require('url');
  var querystring = require('querystring');
  var uriParser = require('../../uri-parser');
  var REQUEST_NAME_REG = /(?:(GET|POST|PUT|DELETE|OPTIONS)\s)?([^\s]+)/;

  function Entity() {
    this.request = { method: undefined, uri: undefined };
    this.response = {
      statusCode: undefined,
      headers: [],
      body: undefined,
      data: undefined
    };
  }

  Entity.prototype.setRequestUri = function (template) {
    this.request.uri = uriParser.parse(template);
  };

  Entity.prototype.setRequestMethod = function (method) {
    this.request.method = method;
  };

  Entity.prototype.setResponseCode = function (code) {
    this.response.statusCode = Number(code);
  };

  Entity.prototype.setResponseHeader = function (name, value) {
    var header = {
      name: name,
      value: value,
    };
    var index = this.indexOfResponseHeader(name);
    if (index < 0) {
      this.response.headers.push(header);
    } else {
      this.response.headers[index] = header;
    }
  };

  Entity.prototype.setResponseHeaders = function (headers) {
    var entity = this;
    headers.forEach(function (member) {
      var name = member.content.key.content;
      var value = member.content.value.content;
      entity.setResponseHeader(name, value);
    });
  };

  Entity.prototype.setResponseBody = function (body) {
    this.response.body = body;
    this.response.data = this.isJsonResponse() ? JSON.parse(body) : null;
  };

  Entity.prototype.setFile = function (filename) {
    this.file = filename;
  };

  Entity.prototype.setTitle = function (title) {
    if (!title || !title.length) return;
    var matched = title.match(REQUEST_NAME_REG);
    var uri = URL.parse(matched ? matched[2] : title);
    var queries = uri.query ? querystring.parse(uri.query) : [];
    var withParamQueries = _.chain(queries)
      .keys()
      .map(function (name) { return { name: name, value: queries[name] }; })
      .value()
      ;

    this.request.uri.path = uri.pathname;
    this.request.uri.queries = withParamQueries;
  };

  Entity.prototype.getResponseHeader = function (name) {
    for (var index = 0; index < this.response.headers.length; index++) {
      if (name === this.response.headers[index].name)
        return this.response.headers[index].value;
    }
    return null;
  };

  Entity.prototype.indexOfResponseHeader = function (name) {
    for (var index = 0; index < this.response.headers.length; index++) {
      if (name === this.response.headers[index].name) return index;
    }
    return -1;
  };

  Entity.prototype.isJsonResponse = function () {
    var contentType = this.getResponseHeader('Content-Type');
    return contentType && /json/.test(contentType);
  };

  return Entity;
}());

var EntriesEntity = (function () {
  function Entity() {
    this._stock = { uri: undefined };
    this.rows = [];
  }

  Entity.prototype.createEntry = function () {
    var entry = new EntryEntity();
    entry.setRequestUri(this._stock.uri);
    return entry;
  };

  Entity.prototype.stockUri = function (uri) {
    this._stock.uri = uri;
  };

  Entity.prototype.add = function (entry) {
    this.rows.push(entry);
  };

  Entity.prototype.getCurrent = function () {
    return this.rows.length ? this.rows[this.rows.length - 1] : null;
  };

  Entity.prototype.toJson = function () {
    return this.rows;
  };

  return Entity;
}());

function parseElement(section, entries) {
  var type = section.element;
  switch (type) {
    case 'parseResult':
    case 'category':
    case 'transition':
    case 'httpTransaction':
      break;
    case 'resource': {
      entries.stockUri(section.attributes.href.content);
      break;
    }
    case 'httpRequest': {
      var entry = entries.createEntry();
      entry.setRequestMethod(section.attributes.method.content);
      entry.setFile(external.filename(entry.request.method, entry.request.uri));
      if (section.meta && section.meta.title) {
        entry.setTitle(section.meta.title.content);
      }
      entries.add(entry);
      break;
    }
    case 'httpResponse': {
      var entry = entries.getCurrent();
      entry.setResponseCode(section.attributes.statusCode.content);
      entry.setResponseHeaders(section.attributes.headers.content);
      break;
    }
    case 'asset': {
      var entry = entries.getCurrent();
      entry.setResponseHeader('Content-Type', section.attributes.contentType.content);
      entry.setResponseBody(section.content);
    }
  }

  if (Array.isArray(section.content)) {
    section.content.forEach(function (content) { parseElement(content, entries); });
  }

  return entries;
}

exports.parse = function (rawdata) {
  // the use of carriage return(s) '\r' in source data supported
  rawdata = rawdata.replace(/\r/g, '\n');

  var data = protagonist.parseSync(rawdata, {generateSourceMap: false, requireBlueprintName: false});
  var warnings = data.warnings ? data.warnings : [];

  // convert data to entry in recursively
  var entries = parseElement(data, new EntriesEntity());

  return {
    entries:  entries.toJson(),
    warnings: warnings
  };
};
