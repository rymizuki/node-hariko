var baker     = require('../'),
    yargs     = require('yargs');

exports.exec = function () {
  var argv = yargs
    // setup common usage
    .usage('$0 [options]')
    // option
    .option('file', {
      demand:   true,
      type:     'string',
      alias:    'f',
      describe: 'filename in the node-glob format of API Blueprint.'
    })
    .option('port', {
      demand:   true,
      type:     'string',
      alias:    'p',
      describe: 'port number of API Server.',
      default:  3000
    })
    .option('host', {
      demand:   true,
      type:     'string',
      describe: 'hostname of API Server.',
      default:  'localhost'
    })
    .option('exclude', {
      demand:   false,
      type:     'string',
      describe: 'exclude filename in the node-glob format.'
    })
    .option('proxy', {
      demand:   false,
      type:     'string',
      describe: 'a origin for proxy request.'
    })
    // logging flag
    .option('verbose', {
      demand:   true,
      type:     'boolean',
      alias:    'v',
      describe: 'output the verbose log.',
      default:  false
    })
    .option('time', {
      demand:   true,
      type:     'boolean',
      alias:    't',
      describe: 'output the logging time',
      default:  false
    })
    // help
    .help('h').alias('h', 'help')
    // get argument;
    .argv
  ;

  baker.start(argv);
}
