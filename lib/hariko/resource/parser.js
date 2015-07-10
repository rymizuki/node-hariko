var JSON        = require('json5');
var logger    = require('../../logger'),
    uriParser = require('../../uri-parser');

function toEntry (action, resource, response) {
  return {
    request:  {
      method: action.method,
      uri:    uriParser.parse(resource.uriTemplate)
    },
    response: {
      statusCode: +response.name,
      headers:    response.headers,
      body:       response.body,
      data:       JSON.parse(response.body)
    }
  };
}

exports.parse = function (data) {
  var entries = [];

  for (var i = 0; i < data.ast.resourceGroups.length; i++) {
    var resourceGroup = data.ast.resourceGroups[i];
    for (var ii = 0; ii < resourceGroup.resources.length; ii++) {
      var resource = resourceGroup.resources[ii];

      for (var iii = 0; iii < resource.actions.length; iii++) {
        var action = resource.actions[iii];

        for (var iiii = 0; iiii < action.examples.length; iiii++) {
          var example = action.examples[iiii];

          for (var iiiii = 0; iiiii < example.responses.length; iiiii++) {
            var response = example.responses[iiiii];
            var entry = toEntry(action, resource, response);
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

  return entries;
};
