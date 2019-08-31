"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uri_parser_1 = require("../../uri-parser");
class RequestBuilder {
    constructor(http_request, base_uri_template) {
        this.http_request = http_request;
        this.base_uri_template = base_uri_template;
    }
    exec() {
        const method = this.http_request.method;
        const uri_template = this.base_uri_template
            ? this.base_uri_template
            : this.http_request.uri_template;
        const uri = new uri_parser_1.UriParser(uri_template).parse();
        return {
            method,
            uri: {
                path: uri.path,
                template: uri.template,
                queries: uri.queries
            }
        };
    }
    static build(request, base_uri_template) {
        return new RequestBuilder(request, base_uri_template).exec();
    }
}
exports.RequestBuilder = RequestBuilder;
