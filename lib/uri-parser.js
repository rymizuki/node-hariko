// SEE ALSO https://github.com/apiaryio/api-blueprint/blob/master/API%20Blueprint%20Specification.md#operators
var _ = require('lodash');

var PARAM_OPERATORS_REG = /\#\+\?\&/g,
    PATHNAME_REG        = /\{(.*?)\}/g,
    URL_SPLIT_REG       = /\{?\?/;

function URIParser (uriTemplate) {
  this.template = uriTemplate;
}

URIParser.prototype = {
  parse: function () {
    this.attrs = this.template.split(URL_SPLIT_REG);

    return {
      template: this.template,
      queries:  this.attrs.length > 1 ? this.parseQuery(this.attrs[1]) : [],
      path:     this.parsePathname(this.attrs[0])
    }
  },
  parseQuery: function (query_string) {
    if (!query_string) return [];
    return _.chain(query_string.split(/\,|\{|\}/g))
      .map(function (str) {
        return str.replace(PARAM_OPERATORS_REG, '');
      })
      .filter(function (str) {
        return str.length > 0;
      })
      .value()
  },
  parsePathname: function (pathname) {
    return pathname.replace(PATHNAME_REG, ':$1');
  }
};

exports.URIParser = URIParser;
exports.parse = function (uriTemplate) {
  return new URIParser(uriTemplate).parse();
};
