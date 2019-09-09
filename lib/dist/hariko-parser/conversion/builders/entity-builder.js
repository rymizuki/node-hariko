"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const response_builder_1 = require("./response-builder");
const request_builder_1 = require("./request-builder");
class EntryBuilder {
    constructor(http_transaction, base_uri_template) {
        this.http_transaction = http_transaction;
        this.base_uri_template = base_uri_template;
    }
    exec() {
        const request = this.buildRequest();
        const response = this.buildResponse();
        return {
            request,
            response,
            file: this.buildFile(request.method, request.uri.path, request.uri.queries)
        };
    }
    buildRequest() {
        return request_builder_1.RequestBuilder.build(this.http_transaction.request, this.base_uri_template);
    }
    buildResponse() {
        return response_builder_1.ResponseBuilder.build(this.http_transaction.response);
    }
    buildFile(method, uri_path, uri_queries) {
        const path_fragments = uri_path.replace(/:/g, '').split(/\//);
        const queries = uri_queries.reduce((prev, query) => {
            if ('string' === typeof query) {
                prev.push(query);
            }
            else {
                prev.push(`${query.name}=${encodeURIComponent(query.value)}`);
            }
            return prev;
        }, []);
        const querystring = queries.length ? `?${queries.join('&')}` : '';
        const basename = `${path_fragments.pop() ||
            'index'}${querystring}-${method}.json`;
        const dirname = path.join.apply(path, path_fragments);
        return path.join(dirname, basename);
    }
    static build(http_transaction) {
        return new EntryBuilder(http_transaction).exec();
    }
    static buildAbstractly(http_transaction) {
        const uri_template = http_transaction.transition.resource.uri_template;
        return new EntryBuilder(http_transaction, uri_template).exec();
    }
}
exports.EntryBuilder = EntryBuilder;
