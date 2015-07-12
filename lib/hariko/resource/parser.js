var JSON        = require('json5'),
    protagonist = require('protagonist');
var logger    = require('../../logger'),
    uriParser = require('../../uri-parser');

var REQUEST_NAME_REG = /(GET|POST|PUT|DELETE|OPTIONS) ([^\s]+)/;

function toEntry (resource, action, example, request, response) {
  return {
    request:  {
      method: action.method,
      uri:    uriParser.parse(action.attributes.uriTemplate || resource.uriTemplate)
    },
    response: {
      statusCode: +response.name,
      headers:    response.headers,
      body:       response.body,
      data:       response.body ? JSON.parse(response.body) : null
    }
  };
}

exports.parse = function (rawdata) {
  var entries  = [],
      warnings = null;
  var data = protagonist.parseSync(rawdata);
  if (data.warnings) warnings = data.warnings;
  for (var i = 0; i < data.ast.resourceGroups.length; i++) {
    var resourceGroup = data.ast.resourceGroups[i];
    for (var ii = 0; ii < resourceGroup.resources.length; ii++) {
      var resource = resourceGroup.resources[ii];

      for (var iii = 0; iii < resource.actions.length; iii++) {
        var action = resource.actions[iii];

        for (var iiii = 0; iiii < action.examples.length; iiii++) {
          var example = action.examples[iiii];

          for (var iiiii = 0; iiiii < example.responses.length; iiiii++) {
            var request   = example.requests[iiiii],
                response  = example.responses[iiiii];
            var entry = toEntry(resource, action, example, request, response);
            entries.push(entry);
            logger.verbose('  req: %s %s  res: %s',
                entry.request.method,
                entry.request.uri.path,
                entry.response.statusCode);
          }
        }
      }
    }
  }

  return {
    entries:  entries,
    warnings: warnings
  };
};
