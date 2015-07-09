var Hariko = require('./hariko');

exports.start = function (argv) {
  Hariko.create(argv).exec();
}
