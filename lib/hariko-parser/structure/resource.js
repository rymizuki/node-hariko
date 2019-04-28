"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transition_1 = require("./transition");
class ResourceStructure {
    constructor(uri_template) {
        this.uri_template = uri_template;
        this.transitions = [];
    }
    addTransition(transition) {
        this.transitions.push(transition);
    }
    createTransition(data) {
        return transition_1.TransitionStructure.create(this, data);
    }
    static create(uri_template) {
        return new ResourceStructure(uri_template);
    }
}
exports.ResourceStructure = ResourceStructure;
