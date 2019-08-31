"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AnnotationsStructure {
    constructor() {
        this.rows = [];
    }
    add(annotation) {
        this.rows.push(annotation);
    }
    toJson() {
        return [];
    }
    static create() {
        return new AnnotationsStructure();
    }
}
exports.AnnotationsStructure = AnnotationsStructure;
