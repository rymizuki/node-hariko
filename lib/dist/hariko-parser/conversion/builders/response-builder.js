"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const json5_1 = __importDefault(require("json5"));
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
            if (!this.body.length) {
                return {};
            }
            // remove zero width space
            return json5_1.default.parse(this.body.replace(/[\u200B-\u200D\uFEFF]/g, ''));
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
