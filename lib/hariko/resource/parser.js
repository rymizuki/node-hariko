var URL         = require('url'),
    querystring = require('querystring'),
    JSON        = require('json5'),
    protagonist = require('protagonist'),
    _           = require('lodash');
var logger    = require('../../logger'),
    external  = require('./external'),
    uriParser = require('../../uri-parser');

var REQUEST_NAME_REG = /(?:(GET|POST|PUT|DELETE|OPTIONS)\s)?([^\s]+)/;

function parseRequestName (name) {
  if (!name) return;
  var matched = name.match(REQUEST_NAME_REG);
  var method, uri;
  if (matched) {
    method  = matched[1];
    uri     = matched[2];
    logger.debug('%j', matched);
  } else {
    uri     = name;
  }
  uri = URL.parse(uri);
  queries = uri.query ? querystring.parse(uri.query) : [];
  queries = _.chain(queries)
    .keys()
    .map(function (name) { return {name: name, value: queries[name]}; })
    .value();
  return {
    path:     uri.pathname,
    queries:  queries
  };
}

function toEntry (resource, action, example, request, response) {
  var method  = action.method,
      uri     = uriParser.parse(action.attributes.uriTemplate || resource.uriTemplate);

  var is_json;
  for (var i = 0; i < response.headers.length; i++) {
    if (response.headers[i].name !== 'Content-Type') continue;
    is_json = /json/.test(response.headers[i].value);
    break;
  }

  return {
    request: {
      method: method,
      uri:    uri
    },
    response: {
      statusCode: +response.name,
      headers:    response.headers,
      body:       response.body,
      data:       response.body && is_json ? JSON.parse(response.body) : null
    }
  };
}

exports.parse = function (rawdata) {
  var entries  = [],
      warnings = null;

  // the use of carriage return(s) '\r' in source data supported
  rawdata = rawdata.replace(/\r/g, '\n')

  var data = protagonist.parseSync(rawdata, {type: 'ast'});

  if (data.warnings) warnings = data.warnings;

  for (var i = 0; i < data.ast.resourceGroups.length; i++) {
    var resourceGroup = data.ast.resourceGroups[i];
    for (var ii = 0; ii < resourceGroup.resources.length; ii++) {
      var resource = resourceGroup.resources[ii];

      for (var iii = 0; iii < resource.actions.length; iii++) {
        var action = resource.actions[iii];
        var initialEntry = null;

        for (var iiii = 0; iiii < action.examples.length; iiii++) {
          var example = action.examples[iiii];

          for (var iiiii = 0; iiiii < example.responses.length; iiiii++) {
            var request   = example.requests[iiiii],
                response  = example.responses[iiiii];
            var entry = toEntry(resource, action, example, request, response);
            entry.file = external.filename(entry.request.method, entry.request.uri);

            if (iiii === 0 && (request && request.name)) {
              initialEntry = _.cloneDeep(entry);
            }

            if (request && request.name) {
              var uri = entry.request.uri;
              entry.request.uri = _.defaults(parseRequestName(request.name), entry.request.uri);
              entry.file = external.filename(entry.request.method, entry.request.uri);
            }
            entries.push(entry);
            logger.verbose('  req: %s %s  res: %s',
              entry.request.method,
              entry.request.uri.path,
              entry.response.statusCode);
          }
        }

        if (initialEntry) {
          entries.push(initialEntry);
          logger.verbose('  req: %s %s  res: %s',
            initialEntry.request.method,
            initialEntry.request.uri.path,
            initialEntry.response.statusCode);
        }
      }
    }
  }

  return {
    entries:  entries,
    warnings: warnings
  };
};
