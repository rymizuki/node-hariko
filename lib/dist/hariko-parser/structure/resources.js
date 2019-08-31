"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resource_1 = require("./resource");
class ResourcesStructure {
    constructor() {
        this.rows = [];
    }
    add(resource) {
        this.rows.push(resource);
    }
    createResource(uri_template) {
        return new resource_1.ResourceStructure(uri_template);
    }
    static create() {
        return new ResourcesStructure();
    }
}
exports.ResourcesStructure = ResourcesStructure;
