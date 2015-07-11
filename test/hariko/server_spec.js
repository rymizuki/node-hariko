var expect  = require('expect.js'),
    sinon   = require('sinon'),
    http    = require('http'),
    subvert = require('require-subvert')(__dirname);

describe('harikoServer', function () {
  var harikoServer,
      resource = {};
  beforeEach(function () {
    harikoServer = subvert.require('../../lib/hariko/server');
  });
  afterEach(function () {
    harikoServer = null;
  });
  describe('default options', function () {
    var server;
    beforeEach(function () {
      server = harikoServer.create(resource, {});
    });

    it('should be options.port is 3000', function () {
      expect(server.options).to.have.property('port', 3000);
    });
    it('should be options.host is localhost', function () {
      expect(server.options).to.have.property('host', 'localhost');
    });
    it('should be options.proxy is false', function () {
      expect(server.options).to.have.property('proxy', false);
    });
    it('should be options.cors is false', function () {
      expect(server.options).to.have.property('cors', false);
    });
    it('should be options.verbose is false', function () {
      expect(server.options).to.have.property('verbose', false);
    });
  });
  describe('.setup()', function () {
    describe('when options.verbose is true', function () {
      beforeEach(function () {
        server = harikoServer.create(resource, {verbose: true});
      });
      beforeEach(function () {
        sinon.stub(server.app, 'all');
      });
      afterEach(function () {
        server.app.all.restore();
      });
      it('should be enable logging middleware', function () {
        server.setup();
        expect(server.app.all.args[0][0]).to.be.eql("*");
        expect(server.app.all.args[0][1].toString())
          .to.be.eql(require('../../lib/hariko/server-middleware/logging')().toString());
      });
    });
    describe('when options.cors is true', function () {
      beforeEach(function () {
        server = harikoServer.create(resource, {cors: true});
      });
      beforeEach(function () {
        sinon.stub(server.app, 'use');
      });
      afterEach(function () {
        server.app.use.restore();
      });
      it('should be enable cors middleware', function () {
        server.setup();
        expect(server.app.use.args[0][0].toString())
          .to.be.eql(require('../../lib/hariko/server-middleware/cors')().toString());
      });
    });
    describe('when options.cors is object', function () {
      beforeEach(function () {
        server = harikoServer.create(resource, {cors: {
          'Access-Control-Allow-Origin':  'http://localhost:3030',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type,X-API-Status'
        }});
      });
      beforeEach(function () {
        sinon.stub(server.app, 'use');
      });
      afterEach(function () {
        server.app.use.restore();
      });
      it('should be enable cors middleware', function () {
        server.setup();
        expect(server.app.use.args[0][0].toString())
          .to.be.eql(require('../../lib/hariko/server-middleware/cors')().toString());
      });
    });
    describe('when options.proxy is exists', function () {
      beforeEach(function () {
        server = harikoServer.create(resource, {proxy: 'http://localhost:8000'});
      });
      beforeEach(function () {
        sinon.stub(server.app, 'all');
      });
      afterEach(function () {
        server.app.all.restore();
      });
      it('should be enable proxy middleware', function () {
        server.setup();
        expect(server.app.all.args[0][0]).to.be.eql('*');
        expect(server.app.all.args[0][1].toString())
          .to.be.eql(require('../../lib/hariko/server-middleware/proxy')().toString());
      });
    });
  })
  describe('.start()', function () {
    describe('default options', function () {
      var _server;
      beforeEach(function () {
        server = harikoServer.create(resource, {});
      });
      afterEach(function () {
        server = null;
      });
      beforeEach(function () {
        _server = {on: sinon.stub(), listen: sinon.stub()};
        sinon.stub(http, 'createServer').returns(_server);
      });
      afterEach(function () {
        http.createServer.restore();
      });
      it('should be run the server', function () {
        server.start();
        expect(_server.listen.calledOnce).to.be.ok();
        expect(_server.listen.args[0][0]).to.be.eql(3000);
        expect(_server.listen.args[0][1]).to.be.eql('localhost');
      });
    });

    describe('when server listening with options', function () {
      beforeEach(function () {
        server = harikoServer.create(resource, {port: 8080, host: '0.0.0.0'});
      });
      beforeEach(function () {
        _server = {on: sinon.stub(), listen: sinon.stub()};
        sinon.stub(http, 'createServer').returns(_server);
      });
      afterEach(function () {
        http.createServer.restore();
      });
      beforeEach(function () {
        server.start();
      });
      afterEach(function () {
        server = null;
      });

      describe('specied port 8080', function () {
        it('should be listening port is 8080', function () {
          expect(_server.listen.args[0][0]).to.be.eql(8080);
        });
      });
      describe('specied host localhost', function () {
        it('should be listening host is location', function () {
          expect(_server.listen.args[0][1]).to.be.eql('0.0.0.0');
        });
      });
    });

    describe('when server listening with cb', function () {
      var cb;
      beforeEach(function () {
        server = harikoServer.create(resource, {port: 3001});
      });
      afterEach(function () {
        server.stop();
      });
      it('should be call cb', function (done) {
        server.start(done);
      });
    });
  });
  describe('.stop()', function () {
    var _server;
    beforeEach(function () {
      _server = {'close': sinon.stub()};
      server = harikoServer.create(resource, {port: 3002});
      server._server = _server;
    });
    afterEach(function () {
      server = null;
    });
    it('should be call _server.close', function () {
      server.stop();
      expect(_server.close.calledOnce).to.be.ok();
      expect(server._server).to.be.eql(null);
    });
  });
  describe('.reload()', function () {
    beforeEach(function () {
      server = harikoServer.create(resource, {});
      sinon.stub(server, 'start');
      sinon.stub(server, 'stop');
    });
    afterEach(function () {
      server.start.restore();
      server.stop.restore();
    });
    it('should be called start and stop', function () {
      server.reload();
      expect(server.start.calledOnce).to.be.ok();
      expect(server.stop.calledOnce).to.be.ok();
    });
  });
});
