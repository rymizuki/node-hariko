var expect  = require('expect.js'),
    sinon   = require('sinon'),
    express = require('express'),
    request = require('supertest');

describe('server-middleware/logging', function () {
  var app,
      logging = require('../../../lib/hariko/server-middleware/logging'),
      logger  = require('../../../lib/logger');
  beforeEach(function () {
    app = express();
    app.use(logging({}));
    app.all('/', function (req, res, next) {
      res.status(200).send('OK');
    });
  });
  afterEach(function () {
    app = void 0;
  });
  describe('when GET /', function () {
    beforeEach(function () {
      sinon.stub(logger, 'verbose');
    });
    afterEach(function () {
      logger.verbose.restore();
    });
    it('should be called logger', function (done) {
      request(app).get('/').end(function (err, res) {
        if (err) return done(err);
        expect(logger.verbose.called).to.be.ok();
        done();
      });
    });
  });
});
