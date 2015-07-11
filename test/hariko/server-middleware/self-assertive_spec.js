var expect  = require('expect.js'),
    sinon   = require('sinon'),
    express = require('express'),
    request = require('supertest');

describe('server-middleware/self-assertive', function () {
  var app,
      selfAssertive = require('../../../lib/hariko/server-middleware/self-assertive');
  beforeEach(function () {
    app = express();
    app.use(selfAssertive());
    app.all('/', function (req, res, next) {
      res.status(200).send('OK');
    });
  });
  afterEach(function () {
    app = void 0;
  });
  describe('when GET /', function () {
    it('should be `X-Powered-By` is `Hariko API Server`', function (done) {
      request(app)
        .get('/')
        .expect('X-Powered-By', 'Hariko API Server')
        .expect(200, done);
    });
  });
});
