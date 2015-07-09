var colors     = require('colors'),
    dateformat = require('dateformat');
var slice = Array.prototype.slice;
var LOG_LEVELS = {
      error:    4,
      warn:     3,
      info:     2,
      verbose:  1 },
    LOG_COLORS = {
      error:    'red',
      warn:     'yellow',
      info:     'green',
      verbose:  'cyan' };

function Logger () {
}

Logger.prototype = {
  log: function () { // logger.log(level, 'format text', arg1, arg2 ...);
    var args  = slice.call(arguments);
    var level  = args.shift(),
        format = args.shift();
    if (this.level > LOG_LEVELS[level]) return;
    var tag = '[' + level.toUpperCase() + ']'
    var time = this.time ? '[' + dateformat(new Date(), 'HH:MM:ss') + ']' : '';
    args.unshift(tag[LOG_COLORS[level]] + time.grey + ' ' + format);
    console.log.apply(console, args);

  },
  verbose: function () { this.log.apply(this, [].concat('verbose', slice.call(arguments))); },
  info:    function () { this.log.apply(this, [].concat('info',    slice.call(arguments))); },
  warn:    function () { this.log.apply(this, [].concat('warn',    slice.call(arguments))); },
  error:   function () { this.log.apply(this, [].concat('error',   slice.call(arguments))); },
};

var __level = LOG_LEVELS.info;
Object.defineProperty(Logger.prototype, 'level', {
  enumerable:   true,
  configurable: true,
  get: function ()      { return __level;         },
  set: function (value) {        __level = LOG_LEVELS[value]; }
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
