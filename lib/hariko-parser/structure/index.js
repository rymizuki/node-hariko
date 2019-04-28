"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resources_1 = require("./resources");
const annotations_1 = require("./annotations");
/**
 * Convert protagonist's parsing result to hariko's structure
 * @param data ProtagonistParseResult
 */
function build(data) {
    const resources = resources_1.ResourcesStructure.create();
    const annotations = annotations_1.AnnotationsStructure.create();
    data.content[0].content.forEach((content) => {
        if (content.element === 'annotation') {
            annotations.add(content.content);
            return;
        }
        const resource = resources.createResource(content.attributes.href.content);
        content.content.forEach((transition_data) => {
            const transition = resource.createTransition(transition_data);
            transition_data.content.forEach((http_transaction_data) => {
                const http_transaction = transition.createHttpTransaction();
                http_transaction.setHttpRequest(http_transaction.createHttpRequest(http_transaction_data.content[0]));
                http_transaction.setHttpResponse(http_transaction.createHttpResponse(http_transaction_data.content[1]));
                transition.addHttpTransaction(http_transaction);
            });
            resource.addTransition(transition);
        });
        resources.add(resource);
    });
    return resources;
}
exports.build = build;
