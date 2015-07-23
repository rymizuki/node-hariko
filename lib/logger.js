var colors     = require('colors'),
    dateformat = require('dateformat');
var slice = Array.prototype.slice;
var LOG_LEVELS = {
      error:    5,
      warn:     4,
      info:     3,
      verbose:  2,
      debug:    1},
    LOG_COLORS = {
      error:    'red',
      warn:     'yellow',
      info:     'green',
      verbose:  'cyan',
      debug:    'magenta'};

function Logger () {
}

Logger.prototype = {
  log: function () { // logger.log(level, 'format text', arg1, arg2 ...);
    var args  = slice.call(arguments);
    var level  = args.shift();
    if (LOG_LEVELS[this.level] > LOG_LEVELS[level]) return;
    console.log.apply(console, this.format(level, args));
  },
  format: function (level, args) {
    var format = args.shift();
    var tag = '[' + level.toUpperCase() + ']';
    var time = this.time ? '[' + dateformat(new Date(), 'HH:MM:ss:l') + ']' : '';
    args.unshift(time.grey + tag[LOG_COLORS[level]] + ' ' + format);
    return args;
  },
  debug:   function () { this.log.apply(this, [].concat('debug',   slice.call(arguments))); },
  verbose: function () { this.log.apply(this, [].concat('verbose', slice.call(arguments))); },
  info:    function () { this.log.apply(this, [].concat('info',    slice.call(arguments))); },
  warn:    function () { this.log.apply(this, [].concat('warn',    slice.call(arguments))); },
  error:   function () { this.log.apply(this, [].concat('error',   slice.call(arguments))); },
};

var __level = 'info';
Object.defineProperty(Logger.prototype, 'level', {
  enumerable:   true,
  configurable: true,
  get: function ()      { return __level;         },
  set: function (value) {
    if (!LOG_LEVELS[value]) throw new Error("Unsupported log level '"+value+"'");
    __level = value;
  }
});

var __time = false;
Object.defineProperty(Logger.prototype, 'time', {
  enumerable:   true,
  configurable: true,
  get: function ()      { return __time;         },
  set: function (value) {        __time = value; }
});

module.exports = new Logger();
module.exports.Logger = Logger;
