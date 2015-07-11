var expect = require('expect.js'),
    sinon  = require('sinon');

describe('uriParser', function () {
  var uriParser;

  beforeEach(function () {
    uriParser = require('../lib/uri-parser');
  });

  describe('.parse()', function () {
    describe('when given a `/api/app`', function () {
      var uri;
      beforeEach(function () {
        uri = uriParser.parse('/api/app');
      });
      it('should be path is `/api/app`', function () {
        expect(uri.path).to.be('/api/app');
      })
      it('should be template is `/api/app`', function () {
        expect(uri.template).to.be('/api/app');
      });
      it('should be queries is []', function () {
        expect(uri.queries).to.be.eql([]);
      });
    });
    describe('when given a `/api/user/{user_id}`', function () {
      var uri;
      beforeEach(function () {
        uri = uriParser.parse('/api/user/{user_id}');
      });
      it('should be path is `/api/user/:user_id`', function () {
        expect(uri.path).to.be('/api/user/:user_id');
      })
      it('should be template is `/api/user/{user_id}`', function () {
        expect(uri.template).to.be('/api/user/{user_id}');
      });
      it('should be queries is []', function () {
        expect(uri.queries).to.be.eql([]);
      });
    });
    describe('when given a `/api/user/?page`', function () {
      var uri;
      beforeEach(function () {
        uri = uriParser.parse('/api/user/?page');
      });
      it('should be path is `/api/user/`', function () {
        expect(uri.path).to.be('/api/user/');
      })
      it('should be template is `/api/user/?page`', function () {
        expect(uri.template).to.be('/api/user/?page');
      });
      it('should be queries is []', function () {
        expect(uri.queries).to.be.eql(['page']);
      });
    });
    describe('when given a `/api/user/{?page,limit}`', function () {
      var uri;
      beforeEach(function () {
        uri = uriParser.parse('/api/user/{?page,limit}');
      });
      it('should be path is `/api/user/`', function () {
        expect(uri.path).to.be('/api/user/');
      })
      it('should be template is `/api/user/{?page,limit`', function () {
        expect(uri.template).to.be('/api/user/{?page,limit}');
      });
      it('should be queries is []', function () {
        expect(uri.queries).to.be.eql(['page','limit']);
      });
    });
  });
});
