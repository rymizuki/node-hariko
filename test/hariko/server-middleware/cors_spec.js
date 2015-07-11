var expect  = require('expect.js'),
    sinon   = require('sinon'),
    express = require('express'),
    request = require('supertest');

var METHODS = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'OPTIONS'
];

describe('server-middleware/cors', function () {
  var app,
      cors = require('../../../lib/hariko/server-middleware/cors');
  describe('when given no options', function () {
    beforeEach(function () {
      app = express();
      app.use(cors({}));
      app.all('/', function (req, res, next) {
        res.status(200).send('OK');
      });
    });
    afterEach(function () {
      app = void 0;
    });
    METHODS.forEach(function (method) {
      describe('when '+method+' /', function () {
        it('respond with cors headers', function (done) {
          request(app)[method.toLowerCase()]('/')
            .set('Origin', 'http://localhost:8080')
            .set('Access-Control-Request-Method',   method)
            .set('Access-Control-Request-Headers',  'Content-Type')
            .expect('Access-Control-Allow-Origin',  'http://localhost:8080')
            .expect('Access-Control-Allow-Methods', method)
            .expect('Access-Control-Allow-Headers', 'Content-Type')
            .expect(200, done);
        });
      });
    });
  });
  describe('when given options', function () {
    beforeEach(function () {
      app = express();
      app.use(cors({
        'Access-Control-Allow-Origin':  'http://localhost:3030',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,X-API-Status'
      }));
      app.all('/', function (req, res, next) {
        res.status(200).send('OK');
      });
    });
    afterEach(function () {
      app = void 0;
    });
    METHODS.forEach(function (method) {
      describe('when '+method+' /', function () {
        it('respond with cors headers', function (done) {
          request(app)[method.toLowerCase()]('/')
            .set('Origin', 'http://localhost:8080')
            .set('Access-Control-Request-Method',   method)
            .set('Access-Control-Request-Headers',  'Content-Type')
            .expect('Access-Control-Allow-Origin',  'http://localhost:3030')
            .expect('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
            .expect('Access-Control-Allow-Headers', 'Content-Type,X-API-Status')
            .expect(200, done);
        });
      });
    });
  });
});
