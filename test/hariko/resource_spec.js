var expect  = require('expect.js'),
    sinon   = require('sinon');

describe('harikoResource', function () {
  var harikoResource;
  beforeEach(function () {
    harikoResource = require('../../lib/hariko/resource');
  });
  afterEach(function () {
    harikoServer = null;
  });

  describe('.read()', function () {
    var resource;
    beforeEach(function () {
      resource = harikoResource.create(['./test/hariko/fixture/app.md']);
    });
    afterEach(function () {
      resource = null;
    });

    describe('when parse successful', function () {
      it('should be return data', function () {
        resource.read();
        expect(resource._data).to.be.eql([
          {
            "request": {
              "method": "GET",
              "uri": {"path": "/api/app", "template": "/api/app", "queries": []}
            },
            "response": {
              "statusCode": 200,
              "headers": [{"name": "Content-Type", "value": "application/json"}],
              "body": "    {\n      \"status\": 200\n    }\n",
              "data": {"status": 200}
            }
          },
          {
            "request": {
              "method": "POST",
              "uri": {"path": "/api/app", "template": "/api/app", "queries": []}
            },
            "response": {
              "statusCode": 200,
              "headers": [{"name": "Content-Type", "value": "application/json"}],
              "body": "    {\n      \"status\": 200\n    }\n",
              "data": {"status": 200}
            }
          },
          {
            "request": {
              "method": "PUT",
              "uri": {"path": "/api/app", "template": "/api/app", "queries": []}
            },
            "response": {
              "statusCode": 200,
              "headers": [{"name": "Content-Type", "value": "application/json"}],
              "body": "    {\n      \"status\": 200\n    }\n",
              "data": {"status": 200}
            }
          },
          {
            "request": {
              "method": "DELETE",
              "uri": {"path": "/api/app", "template": "/api/app", "queries": []}
            },
            "response": {
              "statusCode": 200,
              "headers": [{"name": "Content-Type", "value": "application/json"}],
              "body": "    {\n      \"status\": 200\n    }\n",
              "data": {"status": 200}
            }
          }
        ]);
      });
      it('should be return empty warnings', function () {
        expect(resource._warnings).to.be.eql([]);
      });
    });
  });

  describe('.watch([cb])', function () {
    var resource;
    beforeEach(function () {
      resource = harikoResource.create(['./test/hariko/fixture/app.md']);
    });
    afterEach(function () {
      resource = null;
    });

    describe('when emited watcher event', function () {
      describe('without callback', function () {
        beforeEach(function () {
          sinon.stub(resource, 'read');
        });
        afterEach(function () {
          resource.read.restore();
        });
        it('should call `resource.read`', function () {
          resource.watch();
          resource.watcher.emit('all');
          expect(resource.read.calledOnce).to.be.ok();
        });
      });
      describe('with callback', function () {
        var cb;
        beforeEach(function () {
          sinon.stub(resource, 'read');
          cb = sinon.stub();
        });
        afterEach(function () {
          resource.read.restore();
          cb = null
        });
        beforeEach(function () {
          resource.watch(cb);
          resource.watcher.emit('all');
        });

        it('should call `resource.read`', function () {
          expect(resource.read.calledOnce).to.be.ok();
        });
        it('should call callback', function () {
          expect(cb.calledOnce).to.be.ok();
        });
      });
    });
  });

  describe('.getEntry()', function () {
    var resource;
    beforeEach(function () {
      resource = harikoResource.create(['./test/hariko/fixture/entries.md']);
    });
    afterEach(function () {
      resource = null;
    });
    describe('resource has empty', function () {
      it('should be return undefined', function () {
        var entry = resource.getEntry({
          method: 'GET',
          path:   '/api/undefined',
          query:  {}
        })
        expect(entry).to.not.be.ok();
      });
    });
    describe('resource has only GET /api/app', function () {
      describe('request is GET /api/app', function () {
        it('should be return entry object', function () {
          var entry = resource.getEntry({
            method: 'GET',
            path:   '/api/app',
            query:  {}
          });
          expect(entry).to.be.eql({
            request: {
              method: 'GET',
              uri: {path: '/api/app', template: '/api/app', queries: []}
            },
            response: {
              statusCode: 200,
              headers: [{name: 'Content-Type', value: 'application/json'}],
              body: '    {\n      \"status\": 200\n    }\n',
              data: {status: 200}
            }
          });
        });
      });
    });
    describe('resource has only GET /api/user/:user_id', function () {
      describe('request is GET /api/user/1111', function () {
        it('should be return entry object', function () {
          var entry = resource.getEntry({
            method: 'GET',
            path:   '/api/user/1111',
            query:  {}
          });
          expect(entry).to.be.eql({
            request: {
              method: 'GET',
              uri: {path: '/api/user/:user_id', template: '/api/user/{user_id}', queries: []}
            },
            response: {
              statusCode: 200,
              headers: [{name: 'Content-Type', value: 'application/json'}],
              body: '    {}\n',
              data: {}
            }
          });
        });
      });
    });
    describe('resource has any requests', function () {
      describe('request is GET /api/item/', function () {
        it('should be return entry object', function () {
          var entry = resource.getEntry({
            method: 'GET',
            path:   '/api/item/',
            query:  {}
          });
          expect(entry).to.be.eql({
            request: {
              method: 'GET',
              uri: {path: '/api/item/', template: '/api/item/{?page}', queries: ['page']}
            },
            response: {
              statusCode: 200,
              headers: [{name: 'Content-Type', value: 'application/json'}],
              body: '    {}\n',
              data: {}
            }
          });
        });
      });
      describe('request is GET /api/item/?page=2', function () {
        it('should be return entry object', function () {
          var entry = resource.getEntry({
            method: 'GET',
            path:   '/api/item/',
            query:  []
          });
          expect(entry).to.be.eql({
            request: {
              method: 'GET',
              uri: {path: '/api/item/', template: '/api/item/{?page}', queries: ['page']}
            },
            response: {
              statusCode: 200,
              headers: [{name: 'Content-Type', value: 'application/json'}],
              body: '    {}\n',
              data: {}
            }
          });
        });
      });
    });
  });
});
