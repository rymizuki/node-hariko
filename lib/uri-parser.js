// SEE ALSO https://github.com/apiaryio/api-blueprint/blob/master/API%20Blueprint%20Specification.md#operators
import _ from 'lodash';

const PARAM_OPERATORS_REG = /\#\+\?\&/g,
      PATHNAME_REG        = /\{(.*?)\}/g,
      URL_SPLIT_REG       = /\{?\?/;

class URIParser {
  constructor (uriTemplate) {
    this.template = uriTemplate;
  }
  parse() {
    this.attrs = this.template.split(URL_SPLIT_REG);

    return {
      template: this.template,
      queries:  this.attrs.length > 1 ? this.parseQuery(this.attrs[1]) : [],
      path:     this.parsePathname(this.attrs[0])
    }
  }
  parseQuery (query_string) {
    if (!query_string) return [];
    return _.chain(query_string.split(/\,|\{|\}/g))
      .map((str) => {
        return str.replace(PARAM_OPERATORS_REG, '');
      })
      .filter((str) => {
        return str.length > 0;
      })
      .value()
  }
  parsePathname (pathname) {
    return pathname.replace(PATHNAME_REG, ':$1');
  }
}

export function parse(uriTemplate) {
  return new URIParser(uriTemplate).parse();
}

