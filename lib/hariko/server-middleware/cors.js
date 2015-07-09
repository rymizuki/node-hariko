module.exports = function (options) {
  return function (req, res, next) {
    res.set('Access-Control-Allow-Origin',
        options.cors['Access-Control-Allow-Origin'] || req.headers.origin);
    res.set('Access-Control-Allow-Methods',
        options.cors['Access-Control-Allow-Methods'] || req.headers['access-control-request-method']);
    res.set('Access-Control-Allow-Headers',
        options.cors['Access-Control-Allow-Headers'] || req.headers['access-control-request-headers']);
    next();
  }
};
