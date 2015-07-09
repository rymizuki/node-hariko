var fs          = require('fs'),
    _           = require('lodash'),
    JSON        = require('json5'),
    protagonist = require('protagonist');
var uriParser = require('../uri-parser');

function HarikoResource (files) {
  this.files = files;
  this._data = {};
  this.warnings = [];
  this.ensureFiles();
}

HarikoResource.prototype = {
  ensureFiles: function () {
    this._data = this._parse(this._loadFile());
  },
  _loadFile: function () {
    return _.chain(this.files)
      .map(function (filepath) {
        return fs.readFileSync(filepath).toString();
      })
      .join('')
      .value();
  },
  _parse: function (rawdata) {
    var data = protagonist.parseSync(rawdata);
    var apiResource = [];

    if (data.warnings)
      this.warnings = data.warnings;

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
              apiResource.push({
                request:  {
                  method: action.method,
                  uri:    uriParser.parse(resource.uriTemplate)
                },
                response: {
                  statusCode: 200,
                  headers:    response.headers,
                  body:       response.body,
                  data:       JSON.parse(response.body)
                }
              });
            }
          }
        }
      }
    }

    return apiResource;
  },
  toJSON: function () {
    return this._data;
  }
};

exports.HarikoResource = HarikoResource;
exports.create = function (files) {
  return new HarikoResource(files);
};

