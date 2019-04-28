"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpRequest {
    constructor(http_transaction, method, orig_uri_template) {
        this.http_transaction = http_transaction;
        this.method = method;
        this.orig_uri_template = orig_uri_template;
    }
    get uri_template() {
        return this.orig_uri_template
            ? this.orig_uri_template
            : this.http_transaction.transition.resource.uri_template;
    }
    clone() {
        return new HttpRequest(this.http_transaction, this.method, this.orig_uri_template);
    }
    hasSpecificUri() {
        return this.orig_uri_template !== null;
    }
    static create(http_transaction, data) {
        let method = data.attributes.method.content;
        let uri_template = data.meta ? data.meta.title.content : null;
        // split method and path from `GET /path/to`
        if (uri_template &&
            uri_template.match(/^(GET|POST|PUT|DELETE|OPTIONS)\s*(.+)$/)) {
            method = RegExp.$1;
            uri_template = RegExp.$2;
        }
        return new HttpRequest(http_transaction, method, uri_template);
    }
}
exports.HttpRequest = HttpRequest;
