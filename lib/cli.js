var baker     = require('../'),
    yargs     = require('yargs');

exports.exec = function () {
  var argv = yargs
    // setup common usage
    .usage('$0 [options]')
    // option
    .option('f', {
      demand:   true,
      type:     'string',
      alias:    'file',
      describe: 'filename in the node-glob format of API Blueprint.'
    })
    .option('p', {
      demand:   true,
      type:     'string',
      alias:    'port',
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
    // help
    .help('h').alias('h', 'help')
    // get argument;
    .argv
  ;

  baker.start(argv);
}
