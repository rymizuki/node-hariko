"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const protagonist = __importStar(require("protagonist"));
const structure = __importStar(require("./structure"));
const conversion = __importStar(require("./conversion"));
class HarikoParser {
    parse(markdown) {
        const protagonistResult = protagonist.parseSync(markdown, {
            generateSourceMap: false,
            requireBlueprintName: false
        });
        const resources = structure.build(protagonistResult);
        return conversion.convert(resources);
    }
}
exports.HarikoParser = HarikoParser;
function parse(markdown) {
    return new HarikoParser().parse(markdown);
}
exports.parse = parse;
