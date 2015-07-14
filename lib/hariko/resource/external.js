var fs      = require('fs'),
    path    = require('path'),
    colors  = require('colors'),
    mkdirp  = require('mkdirp'),
    JSON    = require('json5');
var logger = require('../../logger');

function save (dest, entries) {
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

function filename (method, uri) {
  var path_fragments  = uri.template.split(/\//);
  var basename        = (path_fragments.pop() || 'index') + '-' + method + '.json',
      dirname         = path.join.apply(path, path_fragments);
  logger.debug('dirname :', dirname);
  logger.debug('basename:', basename);
  return path.join(dirname, basename);
}

exports.save      = save;
exports.read      = read;
exports.filename  = filename;
