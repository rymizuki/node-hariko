"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PARAM_OPERATORS_REG = /#\+\?&/g;
const PATHNAME_REG = /\{(.*?)\}/g;
const URL_SPLIT_REG = /\{?\?/;
class UriParser {
    constructor(template) {
        this.template = template;
        const [path, param] = this.template.split(URL_SPLIT_REG);
        this.path_base = path;
        this.param_base = param;
    }
    /**
     * `/path/{name}{?param}`から`{template, queries, path}`に変換
     */
    parse() {
        return {
            template: this.template,
            queries: this.param_base ? this.parseQuery(this.param_base) : [],
            path: this.parsePathName(this.path_base)
        };
    }
    parseQuery(param_base) {
        return param_base
            .split(/,|\{|\}/g)
            .map((param) => param.replace(PARAM_OPERATORS_REG, ''))
            .filter((param) => param.length)
            .map((param) => {
            if (!/=/.test(param)) {
                return param;
            }
            const [name, value] = param.split(/=/);
            return { name, value: decodeURIComponent(value) };
        });
    }
    /**
     * `/path/{name}`を`/path/:name`に変換
     * @param pathname
     */
    parsePathName(pathname) {
        return pathname.replace(PATHNAME_REG, ':$1');
    }
}
exports.UriParser = UriParser;
