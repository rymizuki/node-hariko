"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resources_1 = require("./resources");
const annotations_1 = require("./annotations");
class Builder {
    constructor() {
        this.resources = resources_1.ResourcesStructure.create();
        this.annotations = annotations_1.AnnotationsStructure.create();
    }
    build(data) {
        this.dispatch(data.content[0].content);
        return this.resources;
    }
    dispatch(rows) {
        rows.forEach((row) => {
            if (row.element === 'annotation') {
                this.annotations.add(row.content);
                return;
            }
            if (row.element === 'resource') {
                this.resources.add(this.createResource(row));
                return;
            }
            if (row.element === 'category') {
                this.dispatch(row.content);
                return;
            }
            if (row.element === 'copy') {
                return;
            }
            throw new Error(`hariko-parser unsupported element`);
        });
    }
    createResource(content) {
        const resource = this.resources.createResource(content.attributes.href.content);
        content.content.forEach((transition_data) => {
            const transition = resource.createTransition(transition_data);
            transition_data.content.forEach((http_transaction_data) => {
                if (http_transaction_data.element == 'copy') {
                    return;
                }
                const http_transaction = transition.createHttpTransaction();
                http_transaction.setHttpRequest(http_transaction.createHttpRequest(http_transaction_data.content[0]));
                http_transaction.setHttpResponse(http_transaction.createHttpResponse(http_transaction_data.content[1]));
                transition.addHttpTransaction(http_transaction);
            });
            resource.addTransition(transition);
        });
        return resource;
    }
}
/**
 * Convert protagonist's parsing result to hariko's structure
 * @param data ProtagonistParseResult
 */
function build(data) {
    return new Builder().build(data);
}
exports.build = build;
