import 'colors'
import dateformat from 'dateformat'

type LevelType = 'debug' | 'verbose' | 'info' | 'warn' | 'error'

const LOG_LEVELS = {
  error: 5,
  warn: 4,
  info: 3,
  verbose: 2,
  debug: 1
}
const LOG_COLORS = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  verbose: 'cyan',
  debug: 'magenta'
}

export class Logger {
  private level_name: LevelType
  private time: boolean

  set level(value: LevelType) {
    if (!LOG_LEVELS[value])
      throw new Error("Unsupported log level '" + value + "'")
    this.level_name = value
  }

  get level() {
    return this.level_name
  }

  log(level: LevelType, ...args: any[]) {
    // logger.log(level, 'format text', arg1, arg2 ...);
    if (LOG_LEVELS[this.level] > LOG_LEVELS[level]) return
    console.log.apply(console, this.format(level, args))
  }
  format(level: LevelType, args: any[]) {
    var format = args.shift()
    var tag = '[' + level.toUpperCase() + ']'
    var time = this.time ? '[' + dateformat(new Date(), 'HH:MM:ss:l') + ']' : ''
    args.unshift(time.grey + tag[LOG_COLORS[level]] + ' ' + format)
    return args
  }
  debug(...args: any[]) {
    this.log('debug', ...args)
  }
  verbose(...args: any[]) {
    this.log('verbose', ...args)
  }
  info(...args: any[]) {
    this.log('info', ...args)
  }
  warn(...args: any[]) {
    this.log('warn', ...args)
  }
  error(...args: any[]) {
    this.log('error', ...args)
  }
}

export const logger = new Logger()

export default logger // migration
