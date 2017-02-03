var _ = require('lodash');
var pathToRegexp  = require('path-to-regexp');

function objectize (queries) {
  return _.reduce(queries, function (prev, query) {
    if (_.isObject(query)) prev[query.name] = query.value;
    return prev;
  }, {});
}

function queryPartialMatchLength (query, entryQuery) {
  return _.chain(query)
    .keys()
    .filter(function (key) {
      return query[key] == entryQuery[key];
    })
    .size()
    .value()
  ;
}

function queryKeyMatchLength (query, entryQueries) {
  var entryKeys = _.chain(entryQueries)
    .map(function (query) {
      return  _.isObject(query) ? query.name :
              _.isString(query) ? query      : null;
    })
    .compact()
    .value()
  ;
  return _.chain(query)
    .keys()
    .filter(function (key) {
      return _.includes(entryKeys, key);
    })
    .size()
    .value()
  ;
}

function calcPathMatchingLevel (path, entry) {
  return path == entry.request.uri.path ? 100 : 0;
}

function calcQueryMatchingLevel (query, entry) {
  var entryQuery = objectize(entry.request.uri.queries);
  var entryLength         = entry.request.uri.queries.length;
  var partialMatchLength  = 0;
  var keyMatchLength      = 0;

  if (_.keys(query) == entry.request.uri.queries.length && _.isEqual(query, entryQuery)) {
    return 10;
  } else if ((partialMatchLength = queryPartialMatchLength(query, entryQuery)) > 0) {
    return 5 + (partialMatchLength / entryLength);
  } else if ((keyMatchLength = queryKeyMatchLength(query, entry.request.uri.queries)) > 0) {
    return (keyMatchLength / entryLength);
  } else {
    return 0;
  }
}

function Entries () {
  this.rows = [];
}

Entries.prototype = {
  ensure: function (entries) {
    this.rows = entries;
  },
  get: function (req) {
    return _.chain(this.rows)
      .filter(function (entry) {
        // reject non-matching method
        return req.method == entry.request.method;
      })
      .filter(function (entry) {
        // reject non-matching path
        return pathToRegexp(entry.request.uri.path).exec(req.path);
      })
      .sortBy(function (entry) {
        var pathMatchingLevel  = calcPathMatchingLevel(req.path, entry);
        var queryMatchingLevel = calcQueryMatchingLevel(req.query, entry);
        return pathMatchingLevel + queryMatchingLevel;
      })
      .reverse()
      .head()
      .value()
    ;
  },
  raw: function () {
    return this.rows;
  }
};

module.exports = Entries;
