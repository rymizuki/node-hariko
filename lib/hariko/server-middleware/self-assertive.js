var ASSERTIVE_NAME = 'Hariko API Server';

module.exports = function () {
  return function (req, res, next) {
    res.set('X-Powered-By', ASSERTIVE_NAME);
    next();
  };
};
