var expect   = require('expect.js'),
    sinon    = require('sinon'),
    subvert  = require('require-subvert')(__dirname),
    express  = require('express'),
    request  = require('supertest');
var httpProxy = require('http-proxy');

function createServer (middleware) {
  var app = express();
  app.use(middleware);
  app.all('/', function (req, res, next) {
    res.status(200).send('OK');
  });
  return app;
}

describe('server-middleware/proxy', function () {
  var app,
      proxy,
      proxyServer = { web: function (req, res, options) {
        res.status(200).send('PROXY'); }
      },
      resource;

  beforeEach(function () {
    sinon.spy(proxyServer, 'web');
    sinon.stub(httpProxy, 'createProxyServer').returns(proxyServer);
    subvert.subvert('http-proxy', httpProxy);
  });
  afterEach(function () {
    httpProxy.createProxyServer.restore();
    proxyServer.web.restore();
  });

  beforeEach(function () {
    proxy = subvert.require('../../../lib/hariko/server-middleware/proxy');
  });
  afterEach(function () {
    subvert.cleanUp();
  });

  describe('when resource exists', function () {
    beforeEach(function () {
      resource = { getEntry: sinon.stub().returns({}) }
      app = createServer(proxy('http://localhost:8080', resource));
    });
    afterEach(function () {
      app = void 0;
    });

    it('should be pass to next app', function (done) {
      request(app)
        .get('/')
        .expect(200, done);
    });
  });
  describe('when resource not exists', function () {
    beforeEach(function () {
      resource = { getEntry: sinon.stub().returns() }
      app = createServer(proxy('http://localhost:8080', resource));
    });
    afterEach(function () {
      app = null;
      resource = null;
    });

    it('should be pass to proxy', function (done) {
      request(app)
        .get('/')
        .end(function (err, res) {
          if (err) return done(err);
          expect(proxyServer.web.called).to.be.ok();
          done();
        });
    });
  });
});
