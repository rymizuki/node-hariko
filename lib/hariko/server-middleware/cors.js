module.exports = function (options) {
  options || (options = {});
  return function (req, res, next) {
    res.set('Access-Control-Allow-Origin',
        options['Access-Control-Allow-Origin'] || req.headers.origin);
    res.set('Access-Control-Allow-Methods',
        options['Access-Control-Allow-Methods'] || req.headers['access-control-request-method']);
    res.set('Access-Control-Allow-Headers',
        options['Access-Control-Allow-Headers'] || req.headers['access-control-request-headers']);
    next();
  }
};
