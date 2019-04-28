"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_response_1 = require("./http-response");
const http_request_1 = require("./http-request");
class HttpTransaction {
    constructor(transition) {
        this.transition = transition;
    }
    clone() {
        const http_transaction = new HttpTransaction(this.transition);
        http_transaction.setHttpRequest(this.request.clone());
        http_transaction.setHttpResponse(this.response.clone());
        return http_transaction;
    }
    setHttpRequest(request) {
        this.request = request;
    }
    setHttpResponse(response) {
        this.response = response;
    }
    createHttpRequest(data) {
        return http_request_1.HttpRequest.create(this, data);
    }
    createHttpResponse(data) {
        return http_response_1.HttpResponse.create(this, data);
    }
    static create(transition) {
        return new HttpTransaction(transition);
    }
}
exports.HttpTransaction = HttpTransaction;
