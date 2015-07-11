var expect  = require('expect.js'),
    sinon   = require('sinon'),
    express = require('express'),
    request = require('supertest');

function createServer (middleware) {
  var app = express();
  app.use(middleware);
  app.all('/', function (req, res, next) {
    res.status(200).send('OK');
  });
  return app;
}

describe('server-middleware/routing', function () {
  var app,
      routing,
      resource;

  beforeEach(function () {
    routing = require('../../../lib/hariko/server-middleware/routing');
  });

  describe('when resource exists', function () {
    describe('when resource had a data', function () {
      beforeEach(function () {
        resource = { getEntry: sinon.stub().returns({
          response: {
            statusCode: 200,
            headers: [{name: 'Content-Type', value: 'application/json'}],
            data: { message: 'hello world' }
          }
        }) }
        app = createServer(routing(resource));
      });
      afterEach(function () {
        app = void 0;
      });

      it('should be entry response', function (done) {
        request(app)
          .get('/')
          .expect('Content-Type', 'application/json')
          .expect(JSON.stringify({ message: 'hello world'}))
          .expect(200, done);
      });
    });
    describe('when resource had not data', function () {
      beforeEach(function () {
        resource = { getEntry: sinon.stub().returns({
          response: {
            statusCode: 200,
            headers: [{name: 'Content-Type', value: 'text/plain'}],
            body: 'hello world'
          }
        }) }
        app = createServer(routing(resource));
      });
      afterEach(function () {
        app = void 0;
      });

      it('should be entry response', function (done) {
        request(app)
          .get('/')
          .expect('Content-Type', /text\/plain/)
          .expect('hello world')
          .expect(200, done);
      });
    });
  });
  describe('when resource not exists', function () {
    beforeEach(function () {
      resource = { getEntry: sinon.stub().returns() }
      app = createServer(routing(resource));
    });
    afterEach(function () {
      app = void 0;
    });

    it('should be pass next middleware', function (done) {
      request(app)
        .get('/')
        .expect('OK')
        .expect(200, done);
    });
  });
});
