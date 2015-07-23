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
  var path_fragments  = uri.path.replace(/:/g, '').split(/\//);
  var queries = [];
  for (var i = 0; i < uri.queries.length; i++) {
    var query = uri.queries[i];
    if ('string' === typeof query) {
      queries.push(query);
    } else {
      queries.push(query.name + '=' + encodeURIComponent(query.value));
    }
  }
  var basename        = (path_fragments.pop() || 'index') + (queries.length > 0 ? '?' + queries.join('&') : '') + '-' + method + '.json',
      dirname         = path.join.apply(path, path_fragments);
  logger.debug('dirname :', dirname);
  logger.debug('basename:', basename);
  return path.join(dirname, basename);
}

exports.save      = save;
exports.read      = read;
exports.filename  = filename;
