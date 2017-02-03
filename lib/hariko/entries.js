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

function isPerfectMatch (query, entryLength, entryQuery) {
   return (_.keys(query) == entryLength) && _.isEqual(query, entryQuery);
}

function calcQueryMatchingLevel (query, entry) {
  var entryQueries = entry.request.uri.queries;
  var entryQuery   = objectize();
  var entryLength         = entry.request.uri.queries.length;
  var partialMatchLength  = queryPartialMatchLength(query, entryQuery);
  var keyMatchLength      = queryKeyMatchLength(query, entryQueries);

  if (isPerfectMatch(query, entryLength, entryQuery)) {
    return 10;
  } else if (partialMatchLength > 0) {
    return 5 + (partialMatchLength / entryLength);
  } else if (keyMatchLength > 0) {
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
