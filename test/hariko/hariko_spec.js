var expect  = require('expect.js'),
    sinon   = require('sinon'),
    subvert = require('require-subvert')(__dirname);

describe('Hariko', function () {
  describe('.create(options)', function () {
    var Hariko;
    beforeEach(function () {
      Hariko = require('../../lib/hariko/hariko');
    });
    afterEach(function () {
      Hariko = null;
    });

    describe('parsing glob', function () {
      it('should be glob to file list', function () {
        var hariko = Hariko.create({file: './test/hariko/fixture/**/*.md'});
        expect(hariko.files).to.be.eql([
          './test/hariko/fixture/app.md',
          './test/hariko/fixture/entries.md'
        ]);
      });
    });
  });
  describe('hariko.exec()', function () {
    var Resource,
        resource,
        Server,
        server;
    beforeEach(function () {
      resouce = {}
      server  = {start: sinon.stub()};
      Resource = {create: sinon.stub().returns(resource)};
      Server   = {create: sinon.stub().returns(server)};
      subvert.subvert('../../lib/hariko/resource', Resource);
      subvert.subvert('../../lib/hariko/server',   Server);
    });
    afterEach(function () {
    subvert.cleanUp();
    });
    var hariko;
    beforeEach(function () {
      var Hariko = subvert.require('../../lib/hariko/hariko');
      hariko = Hariko.create({file: './test/hariko/fixture/**/*.md'});
      hariko.exec();
    });
    it('should be create server', function () {
      expect(Server.create.calledOnce).to.be.ok();
    });
    it('should be create resource', function () {
      expect(Resource.create.calledOnce).to.be.ok();
    });
    it('should be start server', function () {
      expect(server.start.calledOnce).to.be.ok();
    });
  });
});
