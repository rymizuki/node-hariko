"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseBuilder {
    constructor(http_response) {
        this.http_response = http_response;
    }
    get status_code() {
        return this.http_response.status_code;
    }
    get headers() {
        return this.http_response.headers;
    }
    get body() {
        return this.http_response.body;
    }
    get data() {
        if (this.http_response.isJsonResponse()) {
            return JSON.parse(this.body);
        }
        return null;
    }
    exec() {
        return {
            statusCode: this.status_code,
            headers: this.headers,
            body: this.body,
            data: this.data
        };
    }
    static build(response) {
        return new ResponseBuilder(response).exec();
    }
}
exports.ResponseBuilder = ResponseBuilder;
