var fs      = require('fs'),
    path    = require('path'),
    colors  = require('colors'),
    mkdirp  = require('mkdirp'),
    JSON    = require('json5');
var logger = require('../../logger');

function save (dest, entries) {
  // save only first response of multiple responses
  var saveFlags = {};
  entries = entries.filter(function (entry) {
    if (saveFlags[entry.file]) {
      return false;
    }
    saveFlags[entry.file] = true;
    return true;
  });

  for (var i = 0; i < entries.length; i++) {
    var entry     = entries[i],
        filepath  = path.join(dest, entry.file),
        data      = entry.response.data;
    logger.debug('Save file `%s`', filepath);
    if (!fs.existsSync(filepath)) {
      mkdirp.sync(path.dirname(filepath));
    }
    fs.writeFileSync(filepath, JSON.stringify(data, null, 4));
    logger.verbose('Output entry to ', filepath.cyan);
  }
}

function read (dest, entry) {
  var raw = fs.readFileSync(path.join(dest, entry.file)).toString();
  return JSON.parse(raw);
}

exports.save      = save;
exports.read      = read;
