"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_transaction_1 = require("./http-transaction");
class TransitionStructure {
    constructor(resource, title) {
        this.resource = resource;
        this.title = title;
        this.http_transactions = [];
    }
    hasMultipleRequest() {
        for (let i = 0; i < this.http_transactions.length; i += 1) {
            const request = this.http_transactions[i].request;
            if (request.hasSpecificUri())
                return true;
        }
        return false;
    }
    addHttpTransaction(http_transaction) {
        this.http_transactions.push(http_transaction);
    }
    createHttpTransaction() {
        return http_transaction_1.HttpTransaction.create(this);
    }
    static create(resource, data) {
        const title = data.meta.title.content;
        return new TransitionStructure(resource, title);
    }
}
exports.TransitionStructure = TransitionStructure;
