"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("colors");
const dateformat_1 = __importDefault(require("dateformat"));
const LOG_LEVELS = {
    error: 5,
    warn: 4,
    info: 3,
    verbose: 2,
    debug: 1
};
const LOG_COLORS = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    verbose: 'cyan',
    debug: 'magenta'
};
class Logger {
    set level(value) {
        if (!LOG_LEVELS[value])
            throw new Error("Unsupported log level '" + value + "'");
        this.level_name = value;
    }
    get level() {
        return this.level_name;
    }
    log(level, ...args) {
        // logger.log(level, 'format text', arg1, arg2 ...);
        if (LOG_LEVELS[this.level] > LOG_LEVELS[level])
            return;
        console.log.apply(console, this.format(level, args)); // eslint-disable-line no-console
    }
    format(level, args) {
        var format = args.shift();
        var tag = '[' + level.toUpperCase() + ']';
        var time = this.time ? '[' + dateformat_1.default(new Date(), 'HH:MM:ss:l') + ']' : '';
        args.unshift(time.grey + tag[LOG_COLORS[level]] + ' ' + format);
        return args;
    }
    debug(...args) {
        this.log('debug', ...args);
    }
    verbose(...args) {
        this.log('verbose', ...args);
    }
    info(...args) {
        this.log('info', ...args);
    }
    warn(...args) {
        this.log('warn', ...args);
    }
    error(...args) {
        this.log('error', ...args);
    }
}
exports.Logger = Logger;
exports.logger = new Logger();
exports.default = exports.logger; // migration
